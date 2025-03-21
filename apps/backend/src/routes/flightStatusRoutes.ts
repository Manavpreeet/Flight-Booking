import express from "express";
import {
    subscribeToFlightStatus,
    updateFlightStatus,
} from "../controllers/flightStatusController";

const router = express.Router();

/**
 * @swagger
 * /api/flights/status/subscribe:
 *   get:
 *     summary: Subscribe to real-time flight status updates
 *     description: Clients can subscribe to real-time flight status changes using Server-Sent Events (SSE).
 *     responses:
 *       200:
 *         description: Connection established successfully, streaming flight status updates.
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: "data: {\"flightId\": \"uuid-flight-123\", \"status\": \"Delayed\"}\\n\\n"
 *       500:
 *         description: Internal server error
 */
router.get("/subscribe", subscribeToFlightStatus);
/**
 * @swagger
 * /api/flights/status/update:
 *   post:
 *     summary: Update flight status
 *     description: Updates the real-time status of a flight and notifies all subscribed clients via SSE.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightId:
 *                 type: string
 *                 example: "uuid-flight-123"
 *               status:
 *                 type: string
 *                 enum: [On-Time, Delayed, Cancelled]
 *                 example: "Delayed"
 *     responses:
 *       200:
 *         description: Flight status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flight status updated to Delayed"
 *                 status:
 *                   type: string
 *                   example: "Delayed"
 *       400:
 *         description: Invalid request - Missing or incorrect flightId/status
 *       500:
 *         description: Internal server error
 */
router.post("/update", updateFlightStatus);

export default router;
