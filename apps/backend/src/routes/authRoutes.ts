import express from "express";
import {
    signUpOrLogin,
    updateUserProfile,
    getUserProfile,
} from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Signup or login a user
 *     description: If the user does not exist, they are signed up. If they exist, the password is checked for login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *       201:
 *         description: Signup successful, email confirmation required
 *       400:
 *         description: Missing fields or incorrect password
 */
router.post("/", signUpOrLogin);

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Allows authenticated users to update their profile details, excluding email.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: "Male"
 *               profile_picture:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/profile.jpg"
 *               payment_details:
 *                 type: string
 *                 example: "Visa ending in 1234"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     profile_picture:
 *                       type: string
 *                     payment_details:
 *                       type: string
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal Server Error
 */
router.patch("/profile", updateUserProfile);

// Get user profile
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the profile details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile", getUserProfile);

export default router;
