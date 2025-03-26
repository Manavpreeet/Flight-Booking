import { airports } from "@prisma/client";
import prisma from "../config/db";

export const getAirportsService = async (): Promise<airports[]> => {
    return await prisma.airports.findMany();
};
