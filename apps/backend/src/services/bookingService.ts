import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService";

const prisma = new PrismaClient();

const generatePNR = () =>
    "PNR-" + crypto.randomBytes(3).toString("hex").toUpperCase();
const generateETicket = () =>
    "E-TKT-" + crypto.randomBytes(5).toString("hex").toUpperCase();

const reserveSeats = async (flight_leg_id: string, seat_class: string) => {
    const availableSeat = await prisma.flight_seats.findFirst({
        where: {
            flight_leg_id,
            cabin_class: seat_class,
            is_available: true,
        },
    });

    if (!availableSeat) throw new Error(`No available seats in ${seat_class}.`);

    await prisma.flight_seats.update({
        where: { id: availableSeat.id },
        data: {
            is_available: false,
            reserved_until: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    return availableSeat.id;
};

export const bookFlight = async (
    user_id: string,
    trip_type: string,
    flights: any[],
    total_amount: number
) => {
    try {
        console.log("BookingPage", user_id as string);

        const userData = await prisma.public_users.findFirst({
            where: { id: user_id },
        });

        if (!userData) throw new Error("User not found.");

        const itinerary = await prisma.itineraries.create({
            data: {
                users: {
                    connect: { id: user_id },
                },
                trip_type,
            },
        });
        const reservedSeats: string[] = [];
        for (const flight of flights) {
            const seat_id = await reserveSeats(
                flight.flight_leg_id,
                flight.seat_class
            );
            reservedSeats.push(seat_id);

            await prisma.itinerary_flights.create({
                data: {
                    itinerary_id: itinerary.id,
                    flight_leg_id: flight.flight_leg_id,
                    segment_number: flights.indexOf(flight) + 1,
                },
            });
        }

        let e_ticket = generateETicket();
        const booking = await prisma.bookings.create({
            data: {
                user_id,
                itinerary_id: itinerary.id,
                status: "Confirmed",
                total_amount,
                e_ticket_code: e_ticket,
            },
        });

        let bookingPassengerData: {
            name: string;
            age: number;
            passenger_type: string;
            booking_id: string;
        }[] = [];

        const passengerKeySet = new Set<string>();

        for (const flight of flights) {
            for (const passenger of flight.passengers) {
                const key = `${passenger.name}-${passenger.age}-${passenger.passenger_type}`;
                if (!passengerKeySet.has(key)) {
                    passengerKeySet.add(key);
                    bookingPassengerData.push({
                        name: passenger.name,
                        age: parseInt(passenger.age),
                        passenger_type: passenger.passenger_type,
                        booking_id: booking.id,
                    });
                }
            }
        }

        await prisma.booking_passengers.createMany({
            data: [...bookingPassengerData].map((passenger) => ({
                name: passenger.name,
                age: passenger.age,
                passenger_type: passenger.passenger_type,
                booking_id: booking.id,
            })),
        });
        let pnr = generatePNR();
        const emailBody = `
        <h2>Booking Confirmation</h2>
        <p>Your flight has been successfully booked!</p>
        <p><strong>PNR:</strong> ${pnr}</p>
        <p><strong>E-Ticket:</strong> ${e_ticket}</p>
        <p>Flight Details: ${booking}</p>
        <p>Thank you for booking with us!</p>
        `;

        await sendEmail(
            userData.email,
            "Your Flight Booking Confirmation",
            emailBody
        );

        console.log(
            `Invoice sent to user ${user_id} for booking ${booking.id}`
        );

        return {
            booking_id: booking.id,
            pnr,
            e_ticket,
            status: "Confirmed",
        };
    } catch (error: any) {
        throw new Error(`Booking failed: ${error.message}`);
    }
};

export const cancelBookingHandler = async (booking_id: string) => {
    try {
        const booking = await prisma.bookings.findUnique({
            where: { id: booking_id },
            include: {
                itineraries: {
                    include: {
                        itinerary_flights: { include: { flight_legs: true } },
                    },
                },
            },
        });

        if (!booking) throw new Error("Booking not found.");

        for (const itineraryFlight of booking.itineraries?.itinerary_flights ||
            []) {
            if (
                new Date(itineraryFlight.flight_legs.departure_time) <
                new Date()
            ) {
                throw new Error(
                    "Flight has already departed. Cancellation not allowed."
                );
            }
        }

        if (booking.status === "Cancelled") {
            throw new Error("Booking has already been cancelled.");
        }

        await prisma.bookings.update({
            where: { id: booking_id },
            data: { status: "Cancelled" },
        });

        await prisma.flight_seats.updateMany({
            where: {
                flight_leg_id: {
                    in:
                        booking.itineraries?.itinerary_flights.map(
                            (f) => f.flight_leg_id
                        ) || [],
                },
            },
            data: { is_available: true, reserved_until: null },
        });

        await prisma.email_notifications.create({
            data: {
                user_id: booking.user_id,
                booking_id,
                email_type: "Booking Cancellation",
                sent_at: new Date(),
            },
        });

        const userData = await prisma.public_users.findFirst({
            where: { id: booking.user_id },
        });

        if (!userData) throw new Error("User not found.");

        const emailBody = `
        <h2>Booking Confirmation</h2>
        <p>Your flight has been successfully canceled!</p>
        <p>Flight Details: ${booking}</p>
        <p>Thank you for booking with us!</p>
        `;

        await sendEmail(
            userData.email,
            "Your Flight Cancellation Confirmation",
            emailBody
        );

        console.log(
            `Cancellation email sent to user ${booking.user_id} for booking ${booking_id}`
        );

        return {
            message: "Booking cancelled successfully",
        };
    } catch (error: any) {
        throw new Error(`Cancellation failed: ${error.message}`);
    }
};

export const modifyBooking = async (
    booking_id: string,
    new_seat_class?: string,
    new_flight_leg_id?: string
) => {
    try {
        const booking = await prisma.bookings.findUnique({
            where: { id: booking_id },
            include: {
                itineraries: {
                    include: {
                        itinerary_flights: {
                            include: {
                                flight_legs: {
                                    include: {
                                        flight_seats: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!booking) throw new Error("Booking not found.");

        if (booking.status === "Cancelled") {
            throw new Error("Booking has already been cancelled.");
        }

        for (const itineraryFlight of booking.itineraries?.itinerary_flights ||
            []) {
            const flightLeg = await prisma.flight_legs.findUnique({
                where: { id: itineraryFlight.flight_leg_id },
            });
            if (flightLeg && new Date(flightLeg.departure_time) < new Date()) {
                throw new Error(
                    "Flight has already departed. Modification not allowed."
                );
            }
        }

        const availableSeat = await prisma.flight_seats.findFirst({
            where: {
                flight_leg_id:
                    new_flight_leg_id ||
                    booking.itineraries?.itinerary_flights[0].flight_leg_id,
                cabin_class:
                    new_seat_class ||
                    booking.itineraries?.itinerary_flights[0].flight_legs
                        .flight_seats[0].cabin_class,
                is_available: true,
            },
        });

        if (!availableSeat) {
            throw new Error(
                `No available seats in ${
                    new_seat_class
                        ? new_seat_class
                        : booking.itineraries?.itinerary_flights[0].flight_legs
                              .flight_seats[0].cabin_class
                }.`
            );
        }

        await prisma.flight_seats.updateMany({
            where: {
                flight_leg_id: availableSeat.flight_leg_id,
            },
            data: { is_available: true },
        });

        await prisma.flight_seats.update({
            where: { id: availableSeat.id },
            data: { is_available: false },
        });

        await prisma.bookings.update({
            where: { id: booking_id },
            data: { total_amount: availableSeat.price, status: "Modified" },
        });

        await prisma.email_notifications.create({
            data: {
                user_id: booking.user_id,
                booking_id,
                email_type: "Booking Modification",
                sent_at: new Date(),
            },
        });

        const userData = await prisma.public_users.findFirst({
            where: { id: booking.user_id },
        });

        if (!userData) throw new Error("User not found.");

        const emailBody = `
        <h2>Booking Modification</h2>
        <p>Your flight has been successfully modified!</p>
        <p>Flight Details: ${booking}</p>
        <p>Thank you for booking with us!</p>
        `;

        await sendEmail(
            userData.email,
            "Your Flight Cancellation modified",
            emailBody
        );

        console.log(
            `Modification email sent to user ${booking.user_id} for booking ${booking_id}`
        );

        return {
            message: "Booking modified successfully",
        };
    } catch (error: any) {
        throw new Error(`Modification failed: ${error.message}`);
    }
};

export const getBookingsHandler = async (user_id: string) => {
    try {
        const bookings = await prisma.bookings.findMany({
            where: { user_id },
            include: {
                booking_passengers: true,
                itineraries: {
                    include: {
                        itinerary_flights: {
                            include: {
                                flight_legs: {
                                    include: {
                                        airports_flight_legs_dest_airport_idToairports:
                                            true,
                                        airports_flight_legs_origin_airport_idToairports:
                                            true,
                                        flights: true,
                                        flight_seats: true,
                                        flight_status_updates: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return bookings;
    } catch (error: any) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
};

export const getBooking = async (booking_id: string) => {
    try {
        const booking = await prisma.bookings.findUnique({
            where: { id: booking_id },
            include: {
                booking_passengers: true,
                itineraries: {
                    include: {
                        itinerary_flights: {
                            include: {
                                flight_legs: {
                                    include: {
                                        airports_flight_legs_dest_airport_idToairports:
                                            true,
                                        airports_flight_legs_origin_airport_idToairports:
                                            true,
                                        flights: true,
                                        flight_seats: true,
                                        flight_status_updates: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return booking;
    } catch (error: any) {
        throw new Error(`Failed to fetch booking: ${error.message}`);
    }
};
