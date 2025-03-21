import { Request, Response } from "express";
import {
    checkUserExists,
    signUpUser,
    loginUser,
} from "../services/authService";
import { UserCredentials } from "../types/authTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const signUpOrLogin = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, password } = req.body as UserCredentials;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    try {
        const userExists = await checkUserExists(email);

        if (!userExists) {
            // 🆕 User does not exist → Signup
            const signUpResponse = await signUpUser({ email, password });

            if (signUpResponse.error) {
                res.status(400).json({ error: signUpResponse.error });
                return;
            }

            res.status(201).json({
                message:
                    "Signup successful! Please check your email to confirm your account.",
                user: signUpResponse.user,
            });
            return;
        }

        // 🔹 User exists → Login
        const loginResponse = await loginUser({ email, password });

        if (loginResponse.error) {
            res.status(400).json({ error: loginResponse.error });
            return;
        }

        let userDb = await prisma.public_users.findFirst({
            where: {
                email: email,
            },
        });
        res.status(200).json({
            message: "Login successful!",
            user: loginResponse.user,
            session: loginResponse.session,
            userDb: userDb,
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.query?.user_id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await prisma.public_users.findUnique({
            where: { id: userId as string },
        });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.query?.user_id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const {
            first_name,
            last_name,
            phone,
            gender,
            profile_picture,
            card_number,
            expiry_date,
            upi_id,
        } = req.body;

        const updatedUser = await prisma.public_users.update({
            where: { id: userId as string },
            data: {
                first_name,
                last_name,
                phone,
                gender,
                profile_picture,
                card_number: card_number,
                card_expiry: expiry_date,
                upi: upi_id,
            },
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
        return;
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
