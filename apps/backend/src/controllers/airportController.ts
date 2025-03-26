import { Request, Response } from "express";
import { bookFlight } from "../services/bookingService";
import { getAirportsService } from "../services/airportService";

/**
 * Get flight bookings of the user.
 */

export const getAirports = async (req: Request, res: Response) => {
    try {
        const bookings = await getAirportsService();
        res.json(bookings);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};
