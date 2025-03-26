// test/unit/services/flightService.test.ts

jest.mock("../../../src/config/db", () => {
    return {
        __esModule: true,
        default: {
            flight_legs: {
                findMany: jest.fn(),
            },
        },
    };
});

import {
    getDirectFlights,
    getConnectingFlights,
} from "../../../src/services/flightService";
import prisma from "../../../src/config/db";

describe("getDirectFlights", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockFlightLegs = [
        {
            id: "leg-1",
            flight_id: "flight-1",
            origin_airport_id: "origin-1",
            dest_airport_id: "dest-1",
            departure_time: new Date("2025-04-01T10:00:00Z"),
            arrival_time: new Date("2025-04-01T12:00:00Z"),
            leg_number: 1,
            layover_time: null,
            duration: 120,
            airports_flight_legs_origin_airport_idToairports: {
                name: "Delhi",
                code: "DEL",
                city: "Delhi",
                country: "India",
            },
            airports_flight_legs_dest_airport_idToairports: {
                name: "Mumbai",
                code: "BOM",
                city: "Mumbai",
                country: "India",
            },
            flights: {
                id: "flight-1",
                flight_number: "AI202",
                status: "Scheduled",
                created_at: new Date(),
                airlines: {
                    id: "airline-1",
                    name: "Air India",
                    code: "AI",
                    country: "India",
                },
            },
            flight_seats: [
                {
                    id: "seat-1",
                    flight_leg_id: "leg-1",
                    cabin_class: "Economy",
                    seat_number: "1A",
                    is_available: true,
                    price: 5000,
                    discount: 0,
                    reserved_until: null,
                },
                {
                    id: "seat-2",
                    flight_leg_id: "leg-1",
                    cabin_class: "Economy",
                    seat_number: "1B",
                    is_available: true,
                    price: 5000,
                    discount: 0,
                    reserved_until: null,
                },
            ],
        },
    ];

    it("should return flights with enough available seats", async () => {
        (prisma.flight_legs.findMany as jest.Mock).mockResolvedValue(
            mockFlightLegs
        );

        const result = await getDirectFlights(
            2,
            "origin-1",
            "dest-1",
            "2025-04-01",
            "Economy"
        );

        expect(prisma.flight_legs.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    origin_airport_id: "origin-1",
                    dest_airport_id: "dest-1",
                }),
            })
        );

        expect(result).toHaveLength(1);
        expect(result[0].flight.flight_number).toBe("AI202");
        expect(result[0].seats).toHaveLength(2);
    });

    it("should exclude flights with insufficient seats", async () => {
        const notEnoughSeats = [
            {
                ...mockFlightLegs[0],
                flight_seats: [{ ...mockFlightLegs[0].flight_seats[0] }],
            },
        ];
        (prisma.flight_legs.findMany as jest.Mock).mockResolvedValue(
            notEnoughSeats
        );

        const result = await getDirectFlights(
            2,
            "origin-1",
            "dest-1",
            "2025-04-01",
            "Economy"
        );

        expect(result).toEqual([]);
    });
});

describe("getConnectingFlights", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockFirstLeg = {
        id: "leg-1",
        flight_id: "flight-1",
        origin_airport_id: "DEL",
        dest_airport_id: "HYD",
        departure_time: new Date("2025-04-01T08:00:00Z"),
        arrival_time: new Date("2025-04-01T10:00:00Z"),
        leg_number: 1,
        layover_time: null,
        duration: 120,
        airports_flight_legs_origin_airport_idToairports: {
            name: "Delhi",
            code: "DEL",
            city: "Delhi",
            country: "India",
        },
        airports_flight_legs_dest_airport_idToairports: {
            name: "Hyderabad",
            code: "HYD",
            city: "Hyderabad",
            country: "India",
        },
        flights: {
            id: "flight-1",
            flight_number: "AI101",
            status: "Scheduled",
            created_at: new Date(),
            airlines: {
                id: "airline-1",
                name: "Air India",
                code: "AI",
                country: "India",
            },
        },
        flight_seats: [
            {
                id: "seat-1",
                flight_leg_id: "leg-1",
                cabin_class: "Economy",
                seat_number: "1A",
                is_available: true,
                price: 5000,
                discount: 0,
                reserved_until: null,
            },
        ],
    };

    const mockSecondLeg = {
        id: "leg-2",
        flight_id: "flight-2",
        origin_airport_id: "HYD",
        dest_airport_id: "BOM",
        departure_time: new Date("2025-04-01T12:00:00Z"),
        arrival_time: new Date("2025-04-01T14:00:00Z"),
        leg_number: 2,
        layover_time: null,
        duration: 120,
        airports_flight_legs_origin_airport_idToairports: {
            name: "Hyderabad",
            code: "HYD",
            city: "Hyderabad",
            country: "India",
        },
        airports_flight_legs_dest_airport_idToairports: {
            name: "Mumbai",
            code: "BOM",
            city: "Mumbai",
            country: "India",
        },
        flights: {
            id: "flight-2",
            flight_number: "6E404",
            status: "Scheduled",
            created_at: new Date(),
            airlines: {
                id: "airline-2",
                name: "IndiGo",
                code: "6E",
                country: "India",
            },
        },
        flight_seats: [
            {
                id: "seat-2",
                flight_leg_id: "leg-2",
                cabin_class: "Economy",
                seat_number: "2B",
                is_available: true,
                price: 4800,
                discount: 0,
                reserved_until: null,
            },
        ],
    };

    it("should return one valid connecting flight", async () => {
        // First call to findMany returns first legs
        (prisma.flight_legs.findMany as jest.Mock)
            .mockResolvedValueOnce([mockFirstLeg])
            .mockResolvedValueOnce([mockSecondLeg]);

        const result = await getConnectingFlights(
            1,
            "DEL",
            "BOM",
            "2025-04-01",
            "Economy"
        );

        expect(result).toHaveLength(1);
        expect(result[0].legs).toHaveLength(2);
        expect(result[0].legs[0].origin_airport.code).toBe("DEL");
        expect(result[0].legs[1].destination_airport.code).toBe("BOM");
    });

    it("should return empty list if layover does not match", async () => {
        const invalidSecondLeg = {
            ...mockSecondLeg,
            departure_time: new Date("2025-04-01T09:00:00Z"),
        }; // Too early

        (prisma.flight_legs.findMany as jest.Mock)
            .mockResolvedValueOnce([mockFirstLeg])
            .mockResolvedValueOnce([invalidSecondLeg]);

        const result = await getConnectingFlights(
            1,
            "DEL",
            "BOM",
            "2025-04-01",
            "Economy"
        );

        expect(result).toEqual([]); // No valid layover
    });

    it("should return empty list if available seats are insufficient", async () => {
        const insufficientSeats = {
            ...mockSecondLeg,
            flight_seats: [
                { ...mockSecondLeg.flight_seats[0], is_available: false },
            ],
        };

        (prisma.flight_legs.findMany as jest.Mock)
            .mockResolvedValueOnce([mockFirstLeg])
            .mockResolvedValueOnce([insufficientSeats]);

        const result = await getConnectingFlights(
            1,
            "DEL",
            "BOM",
            "2025-04-01",
            "Economy"
        );

        expect(result).toEqual([]); // Not enough available seats
    });
});
