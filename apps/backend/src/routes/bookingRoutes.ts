import express from "express";
import {
    createBooking,
    getBookingHandler,
} from "../controllers/bookingController";
import {
    cancelBooking,
    modifyBookingHandler,
    getBookings,
} from "../controllers/bookingController";

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.post("/cancel/:booking_id", cancelBooking);
router.patch("/modify/:booking_id", modifyBookingHandler);
router.get("/:booking_id", getBookingHandler);

export default router;

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings of a user
 *     tags: [Bookings]
 *     description: Retrieves all bookings made by a user including itinerary, flight legs, and passengers.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user ID to fetch bookings for
 *     responses:
 *       200:
 *         description: List of bookings for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingDetail'
 *       404:
 *         description: User not found or has no bookings
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     description: Creates a new booking for one-way, round-trip, or multi-city trips.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingInput'
 *     responses:
 *       200:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBookingResponse'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error during booking creation
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookingInput:
 *       type: object
 *       required:
 *         - user_id
 *         - trip_type
 *         - flights
 *         - total_amount
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: ccda4d1e-7552-4f7c-ab70-0534165fde97
 *         trip_type:
 *           type: string
 *           enum: [one-way, round-trip, multi-city]
 *           example: one-way
 *         flights:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FlightBookingInfo'
 *         total_amount:
 *           type: number
 *           example: 5000

 *     FlightBookingInfo:
 *       type: object
 *       required:
 *         - flight_leg_id
 *         - seat_class
 *         - passengers
 *       properties:
 *         flight_leg_id:
 *           type: string
 *           format: uuid
 *           example: 2b4e9832-984e-47bd-8c76-291dc02588a1
 *         seat_class:
 *           type: string
 *           enum: [Economy, Business, Premium Economy, First]
 *           example: Economy
 *         passengers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NewPassenger'

 *     NewPassenger:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - passenger_type
 *       properties:
 *         name:
 *           type: string
 *           example: Manavpreet
 *         age:
 *           type: string
 *           example: "34"
 *         passenger_type:
 *           type: string
 *           enum: [Adult, Child, Infant]
 *           example: Adult

 *     CreateBookingResponse:
 *       type: object
 *       properties:
 *         booking_id:
 *           type: string
 *           format: uuid
 *           example: 04af9eb2-51e2-41da-a46c-36b5deaa723d
 *         pnr:
 *           type: string
 *           example: PNR-01AB22
 *         e_ticket:
 *           type: string
 *           example: E-TKT-BAA8AC5CB4
 *         status:
 *           type: string
 *           enum: [Confirmed]
 *           example: Confirmed
 */

/**
 * @swagger
 * /api/bookings/cancel/{booking_id}:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     description: Cancel a booking if it hasn’t already been cancelled or the flight hasn’t departed.
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the booking to cancel
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
 *                   example: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid request or cannot cancel
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/FlightAlreadyDeparted'
 *                 - $ref: '#/components/schemas/BookingAlreadyCancelled'
 */

/**
 * @swagger
 * /api/bookings/modify/{booking_id}:
 *   patch:
 *     summary: Modify booking seat class
 *     tags: [Bookings]
 *     description: Update the seat class for a specific booking if valid and available.
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the booking to modify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModifyBookingInput'
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
 *                   example: Booking modified successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid request or seat not available
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/BookingAlreadyCancelled'
 *                 - $ref: '#/components/schemas/FlightAlreadyDeparted'
 *                 - $ref: '#/components/schemas/NoSeatsAvailable'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ModifyBookingInput:
 *       type: object
 *       required:
 *         - new_seat_class
 *         - new_flight_leg_id
 *       properties:
 *         new_seat_class:
 *           type: string
 *           enum: [Economy, Business, Premium Economy, First]
 *           example: Business
 *         new_flight_leg_id:
 *           type: string
 *           format: uuid
 *           example: e16c8050-bd91-44a7-ae5d-9abefb3b501f

 *     BookingAlreadyCancelled:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking has already been cancelled

 *     FlightAlreadyDeparted:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Flight has already departed. Modification not allowed

 *     NoSeatsAvailable:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: No available seats in Economy class
 */

/**
 * @swagger
 * /api/bookings/{booking_id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the booking to retrieve
 *     responses:
 *       200:
 *         description: Booking data with itinerary, flights, passengers, and airport info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingDetail'
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         itinerary_id:
 *           type: string
 *         booking_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [Cancelled, Confirmed, Modified]
 *         total_amount:
 *           type: string
 *         e_ticket_code:
 *           type: string
 *         booking_passengers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Passenger'
 *         itineraries:
 *           $ref: '#/components/schemas/Itinerary'

 *     Passenger:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         booking_id:
 *           type: string
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         passenger_type:
 *           type: string
 *           enum: [Adult, Child, Infant]
 *         passport_number:
 *           type: string
 *           nullable: true

 *     Itinerary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         trip_type:
 *           type: string
 *           enum: [one-way, round-trip, multi-city]
 *         itinerary_flights:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItineraryFlight'

 *     ItineraryFlight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         itinerary_id:
 *           type: string
 *         flight_leg_id:
 *           type: string
 *         segment_number:
 *           type: integer
 *         flight_legs:
 *           $ref: '#/components/schemas/FlightLeg'

 *     FlightLeg:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         flight_id:
 *           type: string
 *         origin_airport_id:
 *           type: string
 *         dest_airport_id:
 *           type: string
 *         departure_time:
 *           type: string
 *           format: date-time
 *         arrival_time:
 *           type: string
 *           format: date-time
 *         leg_number:
 *           type: integer
 *         layover_time:
 *           type: integer
 *           nullable: true
 *         duration:
 *           type: integer
 *         airports_flight_legs_origin_airport_idToairports:
 *           $ref: '#/components/schemas/Airport'
 *         airports_flight_legs_dest_airport_idToairports:
 *           $ref: '#/components/schemas/Airport'
 *         flights:
 *           $ref: '#/components/schemas/Flight'
 *         flight_seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FlightSeat'
 *         flight_status_updates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FlightStatus'

 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         flight_number:
 *           type: string
 *         airline_id:
 *           type: string
 *         total_seats:
 *           type: integer
 *         available_seats:
 *           type: integer
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time

 *     FlightSeat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         flight_leg_id:
 *           type: string
 *         cabin_class:
 *           type: string
 *         seat_number:
 *           type: string
 *         is_available:
 *           type: boolean
 *         price:
 *           type: string
 *         discount:
 *           type: string
 *         reserved_until:
 *           type: string
 *           format: date-time
 *           nullable: true

 *     FlightStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         flight_leg_id:
 *           type: string
 *         status:
 *           type: string
 *         updated_at:
 *           type: string
 *           format: date-time

 *     Airport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 */
