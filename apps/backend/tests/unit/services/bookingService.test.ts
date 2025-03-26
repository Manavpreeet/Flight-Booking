jest.mock("../../../src/utils/emailService", () => ({
    sendEmail: jest.fn(),
}));

jest.mock("crypto", () => ({
    randomBytes: (length: number) => ({
        toString: () => "abcdef".slice(0, length * 2), // consistent mock
    }),
}));

jest.mock("@prisma/client", () => {
    const mPrisma = {
        public_users: { findFirst: jest.fn() },
        itineraries: { create: jest.fn() },
        flight_seats: {
            findFirst: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
        itinerary_flights: { create: jest.fn() },
        bookings: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        booking_passengers: { createMany: jest.fn() },
        email_notifications: { create: jest.fn() },
        flight_legs: { findUnique: jest.fn() },
    };

    return { PrismaClient: jest.fn(() => mPrisma) };
});
import {
    bookFlight,
    cancelBookingHandler,
    modifyBooking,
    getBooking,
} from "../../../src/services/bookingService";
import { sendEmail } from "../../../src/utils/emailService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() as any;

describe("bookFlight", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should book a flight and return booking info", async () => {
        prisma.public_users.findFirst.mockResolvedValue({
            id: "user-1",
            email: "test@example.com",
        });
        prisma.itineraries.create.mockResolvedValue({ id: "itinerary-1" });
        prisma.flight_seats.findFirst.mockResolvedValue({ id: "seat-1" });
        prisma.flight_seats.update.mockResolvedValue({});
        prisma.itinerary_flights.create.mockResolvedValue({});
        prisma.bookings.create.mockResolvedValue({ id: "booking-1" });
        prisma.booking_passengers.createMany.mockResolvedValue({});

        const result = await bookFlight(
            "user-1",
            "one-way",
            [
                {
                    flight_leg_id: "leg-1",
                    seat_class: "Economy",
                    passengers: [
                        {
                            name: "John Doe",
                            age: "25",
                            passenger_type: "Adult",
                        },
                    ],
                },
            ],
            5000
        );

        expect(result).toEqual({
            booking_id: "booking-1",
            e_ticket: expect.stringContaining("E-TKT-"),
            pnr: expect.stringContaining("PNR-"),
            status: "Confirmed",
        });

        expect(sendEmail).toHaveBeenCalledWith(
            "test@example.com",
            "Your Flight Booking Confirmation",
            expect.stringContaining("PNR:")
        );
    });

    it("should throw error if user not found", async () => {
        prisma.public_users.findFirst.mockResolvedValue(null);

        await expect(
            bookFlight("user-404", "round-trip", [], 5000)
        ).rejects.toThrow("Booking failed: User not found.");
    });
});

describe("cancelBookingHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should cancel a booking successfully", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Confirmed",
            user_id: "user-1",
            itineraries: {
                itinerary_flights: [
                    {
                        flight_leg_id: "leg-1",
                        flight_legs: {
                            departure_time: new Date(
                                Date.now() + 60 * 60 * 1000
                            ),
                        }, // future flight
                    },
                ],
            },
        });
        prisma.bookings.update.mockResolvedValue({});
        prisma.flight_seats.updateMany.mockResolvedValue({});
        prisma.email_notifications.create.mockResolvedValue({});
        prisma.public_users.findFirst.mockResolvedValue({
            email: "test@example.com",
        });

        const result = await cancelBookingHandler("booking-1");

        expect(result).toEqual({ message: "Booking cancelled successfully" });
        expect(sendEmail).toHaveBeenCalledWith(
            "test@example.com",
            "Your Flight Cancellation Confirmation",
            expect.stringContaining(
                "Your flight has been successfully canceled"
            )
        );
    });

    it("should throw error if booking not found", async () => {
        prisma.bookings.findUnique.mockResolvedValue(null);

        await expect(cancelBookingHandler("invalid-booking")).rejects.toThrow(
            "Booking not found."
        );
    });

    it("should not allow cancellation if flight already departed", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Confirmed",
            user_id: "user-1",
            itineraries: {
                itinerary_flights: [
                    {
                        flight_legs: {
                            departure_time: new Date(
                                Date.now() - 60 * 60 * 1000
                            ),
                        }, // past flight
                    },
                ],
            },
        });

        await expect(cancelBookingHandler("booking-1")).rejects.toThrow(
            "Flight has already departed. Cancellation not allowed."
        );
    });

    it("should not allow if booking already cancelled", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            status: "Cancelled",
            itineraries: { itinerary_flights: [] },
        });

        await expect(cancelBookingHandler("booking-1")).rejects.toThrow(
            "Booking has already been cancelled."
        );
    });
});

describe("modifyBooking", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should modify booking successfully", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Confirmed",
            user_id: "user-1",
            itineraries: {
                itinerary_flights: [
                    {
                        flight_leg_id: "leg-1",
                        flight_legs: {
                            flight_seats: [{ cabin_class: "Economy" }],
                        },
                    },
                ],
            },
        });

        prisma.flight_legs.findUnique.mockResolvedValue({
            departure_time: new Date(Date.now() + 60 * 60 * 1000),
        });

        prisma.flight_seats.findFirst.mockResolvedValue({
            id: "seat-1",
            flight_leg_id: "leg-1",
            price: 3000,
        });

        prisma.flight_seats.updateMany.mockResolvedValue({});
        prisma.flight_seats.update.mockResolvedValue({});
        prisma.bookings.update.mockResolvedValue({});
        prisma.email_notifications.create.mockResolvedValue({});
        prisma.public_users.findFirst.mockResolvedValue({
            email: "test@example.com",
        });

        const result = await modifyBooking("booking-1", "Economy");

        expect(result).toEqual({ message: "Booking modified successfully" });
        expect(sendEmail).toHaveBeenCalled();
    });

    it("should throw error if no available seats", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Confirmed",
            itineraries: {
                itinerary_flights: [
                    {
                        flight_leg_id: "leg-1",
                        flight_legs: {
                            flight_seats: [{ cabin_class: "Economy" }],
                        },
                    },
                ],
            },
        });

        prisma.flight_legs.findUnique.mockResolvedValue({
            departure_time: new Date(Date.now() + 60 * 60 * 1000),
        });

        prisma.flight_seats.findFirst.mockResolvedValue(null);

        await expect(modifyBooking("booking-1", "Business")).rejects.toThrow(
            "No available seats in Business."
        );
    });

    it("should throw error if booking is cancelled", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Cancelled",
            itineraries: { itinerary_flights: [] },
        });

        await expect(modifyBooking("booking-1", "Economy")).rejects.toThrow(
            "Booking has already been cancelled."
        );
    });
});

describe("getBooking", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return booking data", async () => {
        prisma.bookings.findUnique.mockResolvedValue({
            id: "booking-1",
            status: "Confirmed",
            itineraries: {},
        });

        const result = await getBooking("booking-1");

        expect(result.id).toBe("booking-1");
    });

    it("should throw if booking fetch fails", async () => {
        prisma.bookings.findUnique.mockRejectedValue(new Error("DB error"));

        await expect(getBooking("booking-1")).rejects.toThrow(
            "Failed to fetch booking: DB error"
        );
    });
});
