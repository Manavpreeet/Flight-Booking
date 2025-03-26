import { Request, Response } from "express";
import { bookFlight, getBooking } from "../services/bookingService";
import {
    cancelBookingHandler,
    modifyBooking,
    getBookingsHandler,
} from "../services/bookingService";

/**
 * Get flight bookings of the user.
 */

export const getBookings = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            res.status(400).json({ error: "User ID is required." });
            return;
        }

        const bookings = await getBookingsHandler(user_id as string);
        res.json(bookings);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

/**
 * Handles flight booking requests.
 */
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { user_id, trip_type, flights, total_amount } = req.body;

        if (!user_id || !flights || flights.length === 0 || !total_amount) {
            res.status(400).json({ error: "Missing required fields." });
            return;
        }

        const booking = await bookFlight(
            user_id,
            trip_type,
            flights,
            total_amount
        );
        res.json(booking);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

/**
 * Handles flight booking cancellation.
 */
export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { booking_id } = req.params;

        if (!booking_id) {
            res.status(400).json({ error: "Booking ID is required." });
            return;
        }

        const result = await cancelBookingHandler(booking_id);
        res.json(result);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

/**
 * Handles flight booking modification.
 */
export const modifyBookingHandler = async (req: Request, res: Response) => {
    try {
        const { booking_id } = req.params;
        const { new_seat_class, new_flight_leg_id } = req.body;

        if (!booking_id) {
            res.status(400).json({
                error: "Booking ID is required.",
            });
            return;
        }

        const result = await modifyBooking(
            booking_id,
            new_seat_class,
            new_flight_leg_id
        );
        res.json(result);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

export const getBookingHandler = async (req: Request, res: Response) => {
    try {
        const { booking_id } = req.params;

        if (!booking_id) {
            res.status(400).json({ error: "Booking ID is required." });
            return;
        }

        const booking = await getBooking(booking_id);
        res.json(booking);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};
