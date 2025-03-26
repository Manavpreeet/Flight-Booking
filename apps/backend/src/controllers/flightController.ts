import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { searchFlights } from "../services/flightService";
import { CabinClass, TripType } from "../types/bookingTypes";
import { FlightRoute } from "../types/flightTypes";
import { VALID_CABIN_CLASSES } from "../utils/arrays";

const prisma = new PrismaClient();

/**
 * Get the lowest fare for a given route over a date range
 */
export const getFareCalendar = async (req: Request, res: Response) => {
    try {
        const { origin, destination, startDate, endDate, seatType } = req.query;

        if (!origin || !destination || !startDate || !endDate) {
            res.status(400).json({
                error: "Missing required query parameters",
            });
            return;
        }

        let originDb = await prisma.airports.findUnique({
            where: { code: origin as string },
        });
        let destinationDb = await prisma.airports.findUnique({
            where: { code: destination as string },
        });

        if (!originDb || !destinationDb) {
            res.status(404).json({ error: "Invalid airport code" });
            return;
        }

        if (seatType === undefined) {
            res.status(400).json({ error: "Invalid seat type" });
            return;
        }

        let flights = await prisma.flight_legs.findMany({
            where: {
                origin_airport_id: originDb.id,
                dest_airport_id: destinationDb.id,
                departure_time: {
                    gte: new Date(startDate as string),
                },
                flight_seats: {
                    some: {
                        is_available: true,
                        cabin_class: seatType as string,
                    },
                },
            },
            include: {
                flights: {
                    include: {
                        airlines: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                flight_seats: {
                    select: {
                        price: true,
                        is_available: true,
                        cabin_class: true,
                    },
                },
                airports_flight_legs_origin_airport_idToairports: {
                    select: { name: true, code: true },
                },
                airports_flight_legs_dest_airport_idToairports: {
                    select: { name: true, code: true },
                },
            },
        });

        let fares = flights.map((flight) => {
            return {
                id: flight.id,
                origin: origin,
                destination: destination,
                travel_date: flight.departure_time,
                price: Math.min(
                    ...flight.flight_seats.map((seat) => Number(seat.price))
                ),
                airline: flight.flights.airlines.name,
            };
        });

        res.json({ fares });
        return;
    } catch (error) {
        console.error("❌ Error fetching fare calendar:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

export const getFlights = async (req: Request, res: Response) => {
    try {
        const { number_of_passengers, routes, cabin_class } = req.query;

        if (!routes || !cabin_class || !number_of_passengers) {
            res.status(400).json({
                error: "Routes, Number of Passengers and Cabin Class are required.",
            });
            return;
        }

        const parsedRoutes = JSON.parse(routes as string);

        if (!Array.isArray(parsedRoutes) || parsedRoutes.length === 0) {
            res.status(400).json({ error: "Invalid routes format." });
            return;
        }

        if (
            cabin_class &&
            !VALID_CABIN_CLASSES.includes(cabin_class as string)
        ) {
            res.status(400).json({
                error: `Invalid cabinClass. Must be one of ${VALID_CABIN_CLASSES.join(", ")}`,
            });
            return;
        }

        const flights = await searchFlights(
            parseInt(number_of_passengers as string) as number,
            parsedRoutes as FlightRoute[],
            cabin_class as CabinClass | undefined
        );

        res.json(flights);
        return;
    } catch (error: Error | any) {
        res.status(500).json({
            error: error?.message || "Internal Server Error",
        });
    }
};
