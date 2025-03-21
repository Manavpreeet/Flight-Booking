import express from "express";
import { createBooking } from "../controllers/bookingController";
import { authenticateUser } from "../middleware/authMiddleware";
import {
    cancelBooking,
    modifyBookingHandler,
    getBookings,
} from "../controllers/bookingController";

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Retrieve user bookings
 *     description: Fetch all flight bookings associated with the authenticated user.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: string
 *                     example: "uuid-booking-123"
 *                   pnr:
 *                     type: string
 *                     example: "PNR-ABC123"
 *                   status:
 *                     type: string
 *                     example: "Confirmed"
 *                   flight:
 *                     type: object
 *                     properties:
 *                       flight_number:
 *                         type: string
 *                         example: "AI503"
 *                       airline:
 *                         type: string
 *                         example: "Air India"
 *                       origin:
 *                         type: string
 *                         example: "IXC"
 *                       destination:
 *                         type: string
 *                         example: "BLR"
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a flight
 *     description: Reserves seats, generates PNR & E-Ticket, and sends an invoice.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "uuid-user-123"
 *               trip_type:
 *                 type: string
 *                 enum: [One-way, Round-trip, Multi-city]
 *               flights:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     flight_leg_id:
 *                       type: string
 *                       example: "uuid-flight-leg-1"
 *                     seat_class:
 *                       type: string
 *                       example: "Economy"
 *                     passengers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           age:
 *                             type: integer
 *                             example: 30
 *                           passenger_type:
 *                             type: string
 *                             enum: [Adult, Child, Infant]
 *               total_amount:
 *                 type: number
 *                 example: 5000.00
 *     responses:
 *       200:
 *         description: Booking confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_id:
 *                   type: string
 *                   example: "uuid-booking-123"
 *                 pnr:
 *                   type: string
 *                   example: "PNR-ABC123"
 *                 e_ticket:
 *                   type: string
 *                   example: "E-TKT-XYZ789"
 *                 status:
 *                   type: string
 *                   example: "Confirmed"
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createBooking);

/**
 * @swagger
 * /api/bookings/cancel/{booking_id}:
 *   post:
 *     summary: Cancel a flight booking
 *     description: Cancels a booking before departure and releases reserved seats.
 *     parameters:
 *       - name: booking_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid-booking-123"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking cancelled successfully"
 *                 status:
 *                   type: string
 *                   example: "Cancelled"
 *       400:
 *         description: Invalid request (Missing booking_id)
 *       403:
 *         description: Flight has already departed (Cancellation not allowed)
 *       500:
 *         description: Internal server error
 */
router.post("/cancel/:booking_id", cancelBooking);

/**
 * @swagger
 * /api/bookings/modify/{booking_id}:
 *   patch:
 *     summary: Modify a flight booking
 *     description: Allows users to change seat class or flight details.
 *     parameters:
 *       - name: booking_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid-booking-123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_seat_class:
 *                 type: string
 *                 example: "Business"
 *               new_flight_leg_id:
 *                 type: string
 *                 example: "uuid-flight-leg-2"
 *     responses:
 *       200:
 *         description: Booking modified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking modified successfully"
 *                 new_class:
 *                   type: string
 *                   example: "Business"
 *       400:
 *         description: Invalid request (Missing parameters)
 *       403:
 *         description: Flight has already departed (Modification not allowed)
 *       500:
 *         description: Internal server error
 */
router.patch("/modify/:booking_id", modifyBookingHandler);

export default router;
