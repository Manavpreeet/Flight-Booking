import prisma from "../config/db";
import { CabinClass, TripType } from "../types/bookingTypes";
import { FlightRoute } from "../types/flightTypes";

export const getDirectFlights = async (
    number_of_passengers: number,
    originId: string,
    destinationId: string,
    date: string,
    cabin_class?: string
) => {
    const flightLegs = await prisma.flight_legs.findMany({
        where: {
            origin_airport_id: originId,
            dest_airport_id: destinationId,
            departure_time: {
                gte: new Date(date),
            },
            flights: {
                status: "Scheduled",
            },
        },
        include: {
            airports_flight_legs_origin_airport_idToairports: true,
            airports_flight_legs_dest_airport_idToairports: true,

            flights: {
                include: {
                    airlines: true,
                },
            },
            flight_seats: {
                where: {
                    cabin_class: cabin_class ? cabin_class : undefined,
                },
            },
        },
    });

    let result = flightLegs
        .map((flightLeg) => {
            let availableSeats = flightLeg.flight_seats.reduce(
                (acc, seat) => acc + (seat.is_available ? 1 : 0),
                0
            );
            if (availableSeats < number_of_passengers) {
                return null;
            }
            return {
                id: flightLeg.id,
                flight_id: flightLeg.flight_id,
                origin_airport: {
                    name: flightLeg
                        .airports_flight_legs_origin_airport_idToairports.name,
                    code: flightLeg
                        .airports_flight_legs_origin_airport_idToairports.code,
                    city: flightLeg
                        .airports_flight_legs_origin_airport_idToairports.city,
                    country:
                        flightLeg
                            .airports_flight_legs_origin_airport_idToairports
                            .country,
                },
                destination_airport: {
                    name: flightLeg
                        .airports_flight_legs_dest_airport_idToairports.name,
                    code: flightLeg
                        .airports_flight_legs_dest_airport_idToairports.code,
                    city: flightLeg
                        .airports_flight_legs_dest_airport_idToairports.city,
                    country:
                        flightLeg.airports_flight_legs_dest_airport_idToairports
                            .country,
                },
                departure_time: flightLeg.departure_time,
                arrival_time: flightLeg.arrival_time,
                leg_number: flightLeg.leg_number,
                layover_time: flightLeg.layover_time,
                duration: flightLeg.duration,
                flight: {
                    id: flightLeg.flights.id,
                    flight_number: flightLeg.flights.flight_number,
                    airline: {
                        id: flightLeg.flights.airlines.id,
                        name: flightLeg.flights.airlines.name,
                        code: flightLeg.flights.airlines.code,
                        country: flightLeg.flights.airlines.country,
                    },
                    total_seats: flightLeg.flight_seats.length,
                    available_seats: flightLeg.flight_seats.reduce(
                        (acc, seat) => acc + (seat.is_available ? 1 : 0),
                        0
                    ),
                    status: flightLeg.flights.status,
                    created_at: flightLeg.flights.created_at,
                },
                seats: flightLeg.flight_seats.map((seat) => {
                    return {
                        id: seat.id,
                        flight_leg_id: seat.flight_leg_id,
                        cabin_class: seat.cabin_class,
                        seat_number: seat.seat_number,
                        is_available: seat.is_available,
                        price: Number(seat.price) * number_of_passengers,
                        discount: seat.discount,
                        reserved_until: seat.reserved_until,
                    };
                }),
            };
        })
        .filter((flight) => flight !== null);
    return result;
};

export const getConnectingFlights = async (
    number_of_passengers: number,
    originId: string,
    destinationId: string,
    date: string,
    cabin_class?: string
) => {
    const firstLegs = await prisma.flight_legs.findMany({
        where: {
            origin_airport_id: originId,
            dest_airport_id: { not: destinationId },
            departure_time: {
                gte: new Date(date + "T00:00:00Z"),
            },
        },
        include: {
            airports_flight_legs_origin_airport_idToairports: true,
            airports_flight_legs_dest_airport_idToairports: true,
            flights: {
                include: {
                    airlines: true,
                },
            },
            flight_seats: {
                where: {
                    is_available: true,
                    cabin_class: cabin_class ? cabin_class : undefined,
                },
            },
        },
    });

    const secondLegs = await prisma.flight_legs.findMany({
        where: {
            departure_time: {
                gte: new Date(date + "T00:00:00Z"),
            },
            dest_airport_id: destinationId,
            origin_airport_id: { not: originId },
        },
        include: {
            airports_flight_legs_origin_airport_idToairports: true,
            airports_flight_legs_dest_airport_idToairports: true,
            flights: {
                include: {
                    airlines: true,
                },
            },
            flight_seats: {
                where: {
                    cabin_class: cabin_class ? cabin_class : undefined,
                },
            },
        },
    });

    const connectingFlights: {}[] = [];
    for (const firstLeg of firstLegs) {
        for (const secondLeg of secondLegs) {
            let firstLegAvailableSeats = firstLeg.flight_seats.reduce(
                (acc, seat) => acc + (seat.is_available ? 1 : 0),
                0
            );
            let secondLegAvailableSeats = secondLeg.flight_seats.reduce(
                (acc, seat) => acc + (seat.is_available ? 1 : 0),
                0
            );

            if (
                firstLegAvailableSeats < number_of_passengers ||
                secondLegAvailableSeats < number_of_passengers
            ) {
                continue;
            }

            if (firstLeg.arrival_time < secondLeg.departure_time)
                connectingFlights.push({
                    legs: [
                        {
                            id: firstLeg.id,
                            flight_id: firstLeg.flight_id,
                            origin_airport: {
                                name: firstLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .name,
                                code: firstLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .code,
                                city: firstLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .city,
                                country:
                                    firstLeg
                                        .airports_flight_legs_origin_airport_idToairports
                                        .country,
                            },
                            destination_airport: {
                                name: firstLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .name,
                                code: firstLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .code,
                                city: firstLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .city,
                                country:
                                    firstLeg
                                        .airports_flight_legs_dest_airport_idToairports
                                        .country,
                            },
                            departure_time: firstLeg.departure_time,
                            arrival_time: firstLeg.arrival_time,
                            leg_number: 1,
                            layover_time: firstLeg.layover_time,
                            duration: firstLeg.duration,
                            flight: {
                                id: firstLeg.flights.id,
                                flight_number: firstLeg.flights.flight_number,
                                airline: {
                                    id: firstLeg.flights.airlines.id,
                                    name: firstLeg.flights.airlines.name,
                                    code: firstLeg.flights.airlines.code,
                                    country: firstLeg.flights.airlines.country,
                                },
                                total_seats: firstLeg.flight_seats.length,
                                available_seats: firstLegAvailableSeats,
                                status: firstLeg.flights.status,
                                created_at: firstLeg.flights.created_at,
                            },
                            seats: firstLeg.flight_seats.map((seat) => {
                                return {
                                    id: seat.id,
                                    flight_leg_id: seat.flight_leg_id,
                                    cabin_class: seat.cabin_class,
                                    seat_number: seat.seat_number,
                                    is_available: seat.is_available,
                                    price: seat.price,
                                    discount: seat.discount,
                                    reserved_until: seat.reserved_until,
                                };
                            }),
                        },
                        {
                            id: secondLeg.id,
                            flight_id: secondLeg.flight_id,
                            origin_airport: {
                                name: secondLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .name,
                                code: secondLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .code,
                                city: secondLeg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .city,
                                country:
                                    secondLeg
                                        .airports_flight_legs_origin_airport_idToairports
                                        .country,
                            },
                            destination_airport: {
                                name: secondLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .name,
                                code: secondLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .code,
                                city: secondLeg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .city,
                                country:
                                    secondLeg
                                        .airports_flight_legs_dest_airport_idToairports
                                        .country,
                            },
                            departure_time: secondLeg.departure_time,
                            arrival_time: secondLeg.arrival_time,
                            leg_number: secondLeg.leg_number,
                            layover_time: secondLeg.layover_time,
                            duration: secondLeg.duration,
                            flight: {
                                id: secondLeg.flights.id,
                                flight_number: secondLeg.flights.flight_number,
                                airline: {
                                    id: secondLeg.flights.airlines.id,
                                    name: secondLeg.flights.airlines.name,
                                    code: secondLeg.flights.airlines.code,
                                    country: secondLeg.flights.airlines.country,
                                },
                                total_seats: secondLeg.flight_seats.length,
                                available_seats: secondLegAvailableSeats,
                                status: secondLeg.flights.status,
                                created_at: secondLeg.flights.created_at,
                            },
                            seats: secondLeg.flight_seats.map((seat) => {
                                return {
                                    id: seat.id,
                                    flight_leg_id: seat.flight_leg_id,
                                    cabin_class: seat.cabin_class,
                                    seat_number: seat.seat_number,
                                    is_available: seat.is_available,
                                    price: seat.price,
                                    discount: seat.discount,
                                    reserved_until: seat.reserved_until,
                                };
                            }),
                        },
                    ],
                });
        }
    }
    return connectingFlights;
};

const getTotalPriceForGroup = (
    seats: any[],
    number_of_passengers: number
): number => {
    const sorted = seats
        .filter((s) => s.is_available)
        .sort((a, b) => a.price - b.price)
        .slice(0, number_of_passengers);

    if (sorted.length < number_of_passengers) return Infinity; // Not enough seats

    return sorted.reduce((sum, seat) => sum + seat.price, 0);
};

export const searchFlights = async (
    number_of_passengers: number,
    routes: FlightRoute[],
    cabin_class?: CabinClass
) => {
    const segments: any = [];

    for (let i = 0; i < routes.length; i++) {
        const { origin, destination, date } = routes[i];

        const originAirport = await prisma.airports.findUnique({
            where: { code: origin },
        });
        const destinationAirport = await prisma.airports.findUnique({
            where: { code: destination },
        });

        if (!originAirport) {
            const errorMessage = `Invalid origin airport code: ${origin}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        if (!destinationAirport) {
            const errorMessage = `Invalid destination airport code: ${destination}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const directFlights = await getDirectFlights(
            number_of_passengers,
            originAirport.id,
            destinationAirport.id,
            date,
            cabin_class
        );
        const connectingFlights = await getConnectingFlights(
            number_of_passengers,
            originAirport.id,
            destinationAirport.id,
            date,
            cabin_class
        );

        const getLowestPricedDirectFlight = (
            flights: any[],
            number_of_passengers: number
        ) =>
            [...flights].sort(
                (a, b) =>
                    getTotalPriceForGroup(a.seats, number_of_passengers) -
                    getTotalPriceForGroup(b.seats, number_of_passengers)
            )[0];
        const getLowestPricedConnectingFlight = (
            flights: any[],
            number_of_passengers: number
        ) =>
            [...flights].sort((a, b) => {
                const priceA = a.legs.reduce(
                    (sum: number, leg: any) =>
                        sum +
                        getTotalPriceForGroup(leg.seats, number_of_passengers),
                    0
                );
                const priceB = b.legs.reduce(
                    (sum: number, leg: any) =>
                        sum +
                        getTotalPriceForGroup(leg.seats, number_of_passengers),
                    0
                );
                return priceA - priceB;
            })[0];

        segments.push({
            direct_flights: directFlights,
            connecting_flights: connectingFlights,
            recommendation: {
                direct:
                    getLowestPricedDirectFlight(
                        directFlights,
                        number_of_passengers
                    ) || null,
                connecting:
                    getLowestPricedConnectingFlight(
                        connectingFlights,
                        number_of_passengers
                    ) || null,
            },
        });
    }

    return { segments };
};
