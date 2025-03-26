import express from "express";
import { getFareCalendar, getFlights } from "../controllers/flightController";
const router = express.Router();

router.get("/", getFlights);
router.get("/fare-calendar", getFareCalendar);
export default router;

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Search available flights
 *     tags: [Flights]
 *     description: Search for direct and connecting flights based on trip type, route, date, passengers, and class.
 *     parameters:
 *       - in: query
 *         name: number_of_passengers
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Number of passengers
 *       - in: query
 *         name: trip_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [one-way, round-trip, multi-city]
 *           example: one-way
 *         description: Type of trip
 *       - in: query
 *         name: routes
 *         required: true
 *         schema:
 *           type: string
 *           example: [{"origin":"DXB","destination":"BLR","date":"2025-04-15"}]
 *         description: JSON-encoded array of route segments
 *       - in: query
 *         name: cabin_class
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Economy, Business, Premium Economy, First]
 *           example: Economy
 *         description: Cabin class to filter seats by
 *     responses:
 *       200:
 *         description: Flight search results with direct and connecting flights
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlightSearchResults'
 *       400:
 *         description: Invalid input or missing parameters
 */
/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Search available flights
 *     tags: [Flights]
 *     description: Search for direct and connecting flights based on trip type, route, date, passengers, and class.
 *     parameters:
 *       - in: query
 *         name: number_of_passengers
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Number of passengers
 *       - in: query
 *         name: trip_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [one-way, round-trip, multi-city]
 *           example: one-way
 *         description: Type of trip
 *       - in: query
 *         name: routes
 *         required: true
 *         schema:
 *           type: string
 *           example: [{"origin":"DXB","destination":"BLR","date":"2025-04-15"}]
 *         description: JSON-encoded array of route segments
 *       - in: query
 *         name: cabin_class
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Economy, Business, Premium Economy, First]
 *           example: Economy
 *         description: Cabin class to filter seats by
 *     responses:
 *       200:
 *         description: Flight search results with direct and connecting flights
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlightSearchResults'
 *       400:
 *         description: Invalid input or missing parameters
 */

/**
 * @swagger
 * /api/flights/fare-calendar:
 *   get:
 *     summary: Get fare calendar data for a route
 *     tags: [Flights]
 *     description: Returns daily fare details for flights between origin and destination within the date range.
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *           example: IXC
 *         description: Origin airport IATA code
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *           example: BLR
 *         description: Destination airport IATA code
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-03-19
 *         description: Start of travel date range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-10
 *         description: End of travel date range (YYYY-MM-DD)
 *       - in: query
 *         name: seatType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Economy, Business, Premium Economy, First]
 *           example: Economy
 *         description: Cabin class for which to fetch fare data
 *     responses:
 *       200:
 *         description: Fare data per travel date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FareCalendarResponse'
 *       400:
 *         description: Missing or invalid query parameters
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     FareCalendarResponse:
 *       type: object
 *       properties:
 *         fares:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FareEntry'

 *     FareEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: fa236810-db11-49f8-b57d-dfb1c31ef80b
 *         origin:
 *           type: string
 *           example: IXC
 *         destination:
 *           type: string
 *           example: BLR
 *         travel_date:
 *           type: string
 *           format: date-time
 *           example: 2025-03-21T15:00:00.000Z
 *         price:
 *           type: integer
 *           example: 4300
 *         airline:
 *           type: string
 *           example: Emirates
 */
