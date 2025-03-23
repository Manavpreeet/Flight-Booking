import { PrismaClient, airports } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Check if a user exists in Supabase Auth.
 */
export const getAirports = async (): Promise<airports[]> => {
    const airports = await prisma.airports.findMany();

    return airports;
};
