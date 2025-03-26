// DO NOT import prisma at the top here!

jest.mock("../../../src/config/db", () => {
    return {
        __esModule: true,
        default: {
            airports: {
                findMany: jest.fn(),
            },
        },
    };
});

// After mocking, now import service and prisma
import { getAirportsService } from "../../../src/services/airportService";
import prisma from "../../../src/config/db"; // This now refers to the mocked version
import { airports } from "@prisma/client";

describe("getAirportsService", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return list of airports", async () => {
        const mockAirports: airports[] = [
            {
                id: "1",
                name: "Indira Gandhi Intl",
                code: "DEL",
                city: "Delhi",
                country: "India",
            },
            {
                id: "2",
                name: "Chhatrapati Shivaji Intl",
                code: "BOM",
                city: "Mumbai",
                country: "India",
            },
        ];

        (prisma.airports.findMany as jest.Mock).mockResolvedValue(mockAirports);

        const result = await getAirportsService();

        expect(result).toEqual(mockAirports);
        expect(prisma.airports.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return empty list if no airports found", async () => {
        (prisma.airports.findMany as jest.Mock).mockResolvedValue([]);

        const result = await getAirportsService();

        expect(result).toEqual([]);
        expect(prisma.airports.findMany).toHaveBeenCalledTimes(1);
    });
});
