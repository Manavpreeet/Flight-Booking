import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { searchFlights } from "../services/flightService";

const prisma = new PrismaClient();

/**
 * Get the lowest fare for a given route over a date range
 */
export const getFareCalendar = async (req: Request, res: Response) => {
    try {
        const { origin, destination, startDate, endDate } = req.query;

        if (!origin || !destination || !startDate || !endDate) {
            res.status(400).json({
                error: "Missing required query parameters",
            });
            return;
        }

        const fares = await prisma.fare_calendar.findMany({
            where: {
                origin: origin as string,
                destination: destination as string,
                travel_date: {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string),
                },
            },
            orderBy: { travel_date: "asc" },
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
        const { tripType, routes, cabinClass } = req.query;

        if (!tripType || !routes) {
            res.status(400).json({
                error: "tripType and routes are required.",
            });

            return;
        }

        const parsedRoutes = JSON.parse(routes as string); // Convert JSON string to array
        if (!Array.isArray(parsedRoutes) || parsedRoutes.length === 0) {
            res.status(400).json({ error: "Invalid routes format." });
            return;
        }

        // Validate cabinClass if provided
        const validCabinClasses = [
            "Economy",
            "Premium Economy",
            "Business",
            "First",
        ];
        if (cabinClass && !validCabinClasses.includes(cabinClass as string)) {
            res.status(400).json({
                error: `Invalid cabinClass. Must be one of ${validCabinClasses.join(", ")}`,
            });
            return;
        }

        const flights = await searchFlights(
            tripType as "one-way" | "round-trip" | "multi-city",
            parsedRoutes,
            cabinClass as string | undefined
        );

        res.json(flights);
        return;
    } catch (error: Error | any) {
        res.status(500).json({
            error: error?.message || "Internal Server Error",
        });
    }
};

/**
 * Get alternative flight legs if the requested flight is unavailable, full, or expensive.
 */
export const getAlternativeFlights = async (req: Request, res: Response) => {
    try {
        const { origin, destination, travelDate, maxPrice } = req.query;

        if (!origin || !destination || !travelDate) {
            res.status(400).json({
                error: "Missing required query parameters",
            });
            return;
        }

        // 🔹 Convert Airport Codes to UUIDs
        const originAirport = await prisma.airports.findUnique({
            where: { code: origin as string },
            select: { id: true },
        });

        const destinationAirport = await prisma.airports.findUnique({
            where: { code: destination as string },
            select: { id: true },
        });

        if (!originAirport || !destinationAirport) {
            res.status(404).json({ error: "Invalid airport code" });
            return;
        }

        // 🔹 Query Flight Legs using UUIDs
        const alternatives = await prisma.flight_legs.findMany({
            where: {
                origin_airport_id: originAirport.id,
                dest_airport_id: destinationAirport.id,
                departure_time: {
                    gte: new Date(travelDate as string),
                    lte: new Date(
                        new Date(travelDate as string).setHours(23, 59, 59)
                    ),
                },
                flights: {
                    status: { notIn: ["Cancelled", "Full"] }, // Exclude cancelled and full flights
                },
                flight_seats: {
                    some: {
                        is_available: true, // Ensure seats are available
                        price: maxPrice
                            ? { lte: parseFloat(maxPrice as string) }
                            : undefined, // Filter by max price
                    },
                },
            },
            include: {
                flights: {
                    select: {
                        flight_number: true,
                        airline_id: true,
                        status: true,
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

        if (alternatives.length === 0) {
            res.json({ message: "No alternative flights available" });
            return;
        }

        res.json({ alternatives });
        return;
    } catch (error) {
        console.error("❌ Error fetching alternative flights:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
