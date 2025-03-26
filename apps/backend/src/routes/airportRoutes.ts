import express from "express";
import { getAirports } from "../controllers/airportController";

const router = express.Router();

router.get("/", getAirports);
export default router;

/**
 * @swagger
 * tags:
 *   name: Airports
 *   description: Airport management and lookup
 */

/**
 * @swagger
 * /api/airports:
 *   get:
 *     summary: Get all airports
 *     tags: [Airports]
 *     description: Returns a list of available airports with details.
 *     responses:
 *       200:
 *         description: List of airports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Airport'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Airport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 6d5951af-3214-47cf-beb4-14fea4b3d253
 *         name:
 *           type: string
 *           example: Indira Gandhi International Airport
 *         code:
 *           type: string
 *           example: DEL
 *         city:
 *           type: string
 *           example: Delhi
 *         country:
 *           type: string
 *           example: India
 */
