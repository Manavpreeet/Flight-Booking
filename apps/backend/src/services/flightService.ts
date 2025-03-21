import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fetch direct flights for a given route on a specific date.
 */
const getDirectFlights = async (
    originId: string,
    destinationId: string,
    date: string,
    cabinClass?: string
) => {
    console.log(
        `\nFetching direct flights from ${originId} to ${destinationId} on ${date} with cabin class ${cabinClass}`
    );
    const flights = await prisma.flight_legs.findMany({
        where: {
            origin_airport_id: originId,
            dest_airport_id: destinationId,
            departure_time: {
                gte: new Date(date),
                lte: new Date(date),
            },
            flights: {
                status: "Scheduled",
            },
        },
        include: {
            flights: true,
            flight_seats: {
                where: {
                    is_available: true,
                    cabin_class: cabinClass ? cabinClass : undefined, // Filter by cabinClass if provided
                },
            },
        },
    });
    console.log(`\nFound ${flights.length} direct flights`);
    return flights;
};

/**
 * Fetch connecting flights with one layover for a given route on a specific date.
 */
const getConnectingFlights = async (
    originId: string,
    destinationId: string,
    date: string,
    cabinClass?: string
) => {
    const firstLegs = await prisma.flight_legs.findMany({
        where: {
            origin_airport_id: originId,
            departure_time: {
                gte: new Date(date + "T00:00:00Z"),
                lte: new Date(date + "T23:59:59Z"),
            },
        },
        include: {
            flights: true,
            flight_seats: {
                where: {
                    is_available: true,
                    cabin_class: cabinClass ? cabinClass : undefined,
                },
            },
        },
    });

    const secondLegs = await prisma.flight_legs.findMany({
        where: {
            departure_time: {
                gte: new Date(date + "T00:00:00Z"),
                lte: new Date(date + "T23:59:59Z"),
            },
            dest_airport_id: destinationId,
        },
        include: {
            flights: true,
            flight_seats: {
                where: {
                    is_available: true,
                    cabin_class: cabinClass ? cabinClass : undefined,
                },
            },
        },
    });

    const connectingFlights = [];
    for (const firstLeg of firstLegs) {
        for (const secondLeg of secondLegs) {
            connectingFlights.push({
                firstLeg,
                secondLeg,
            });
        }
    }
    return connectingFlights;
};

/**
 * Search flights for different trip types with cabin class support.
 */
export const searchFlights = async (
    tripType: "one-way" | "round-trip" | "multi-city",
    routes: { origin: string; destination: string; date: string }[],
    cabinClass?: string
) => {
    console.log(
        `\nSearching flights for trip type ${tripType} with routes ${JSON.stringify(routes)} and cabin class ${cabinClass}`
    );
    const results: any = {};

    for (let i = 0; i < routes.length; i++) {
        const { origin, destination, date } = routes[i];
        console.log(
            `\nProcessing segment ${i + 1}: from ${origin} to ${destination} on ${date}`
        );

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
            originAirport.id,
            destinationAirport.id,
            date,
            cabinClass
        );
        const connectingFlights = await getConnectingFlights(
            originAirport.id,
            destinationAirport.id,
            date,
            cabinClass
        );

        results[`segment_${i + 1}`] = { directFlights, connectingFlights };
    }

    console.log(`\nSearch results: ${JSON.stringify(results)}`);
    return results;
};
