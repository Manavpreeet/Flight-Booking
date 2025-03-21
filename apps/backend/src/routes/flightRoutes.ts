import express from "express";
import { searchFlights } from "../services/flightService";
import { Request, Response } from "express";
import {
    getAlternativeFlights,
    getFareCalendar,
    getFlights,
} from "../controllers/flightController";
const router = express.Router();

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Search flights
 *     description: Fetch available flights based on origin, destination, date, and cabin class.
 *     parameters:
 *       - name: origin
 *         in: query
 *         description: Origin airport ID
 *         required: false
 *         schema:
 *           type: string
 *       - name: destination
 *         in: query
 *         description: Destination airport ID
 *         required: false
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         description: Flight departure date (YYYY-MM-DD)
 *         required: false
 *         schema:
 *           type: string
 *       - name: cabinClass
 *         in: query
 *         description: Cabin class (Economy, Business, etc.)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   flight_number:
 *                     type: string
 *                     example: "AI101"
 *                   airline_id:
 *                     type: string
 *                     example: "Air India"
 *                   origin_airport_id:
 *                     type: string
 *                     example: "DEL"
 *                   dest_airport_id:
 *                     type: string
 *                     example: "JFK"
 *                   departure_time:
 *                     type: string
 *                     example: "2025-04-01T10:00:00Z"
 *                   arrival_time:
 *                     type: string
 *                     example: "2025-04-01T20:00:00Z"
 *                   duration:
 *                     type: string
 *                     example: "10 hours"
 *                   price:
 *                     type: number
 *                     example: 750.00
 *                   available_seats:
 *                     type: integer
 *                     example: 5
 *                   cabin_class:
 *                     type: string
 *                     example: "Economy"
 */
router.get("/", getFlights);

/**
 * @swagger
 * /api/fare-calendar:
 *   get:
 *     summary: Get Fare Calendar
 *     description: Fetches the lowest available fares for a given route over a specified date range.
 *     parameters:
 *       - name: origin
 *         in: query
 *         description: Origin airport code (IATA format, e.g., "IXC")
 *         required: true
 *         schema:
 *           type: string
 *           example: "IXC"
 *       - name: destination
 *         in: query
 *         description: Destination airport code (IATA format, e.g., "BLR")
 *         required: true
 *         schema:
 *           type: string
 *           example: "BLR"
 *       - name: startDate
 *         in: query
 *         description: Start date for fare search (YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-03-19"
 *       - name: endDate
 *         in: query
 *         description: End date for fare search (YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-10"
 *     responses:
 *       200:
 *         description: Lowest fares available for each date in the specified range.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fares:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       origin:
 *                         type: string
 *                         example: "IXC"
 *                       destination:
 *                         type: string
 *                         example: "BLR"
 *                       travel_date:
 *                         type: string
 *                         format: date
 *                         example: "2025-03-20"
 *                       price:
 *                         type: number
 *                         example: 5200
 *                       airline:
 *                         type: string
 *                         example: "Indigo"
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required query parameters"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get("/fare-calendar", getFareCalendar);

router.get("/alternate", getAlternativeFlights);
export default router;
