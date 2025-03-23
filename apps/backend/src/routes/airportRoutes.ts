import express from "express";
import { getBookings } from "../controllers/airportController";

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of bookings
 *     responses:
 *       200:
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The booking ID
 *                     example: '12345'
 *                   flightNumber:
 *                     type: string
 *                     description: The flight number
 *                     example: 'AI-202'
 *                   departure:
 *                     type: string
 *                     description: The departure location
 *                     example: 'JFK'
 *                   arrival:
 *                     type: string
 *                     description: The arrival location
 *                     example: 'LAX'
 *                   date:
 *                     type: string
 *                     description: The date of the flight
 *                     example: '2023-10-01'
 */
router.get("/", getBookings);
export default router;
