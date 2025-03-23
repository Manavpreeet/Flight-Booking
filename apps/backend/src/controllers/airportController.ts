import { Request, Response } from "express";
import { bookFlight } from "../services/bookingService";
import { getAirports } from "../services/airportService";

/**
 * Get flight bookings of the user.
 */

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await getAirports();
        res.json(bookings);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};
