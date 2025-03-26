import { supabase } from "../config/supabase";
import { AuthResponse, UserCredentials } from "../types/authTypes";
import { PrismaClient } from "@prisma/client";
import logger from "../config/logger";
const prisma = new PrismaClient();

export const checkUserExists = async (
    email: string
): Promise<{ exist: boolean; error?: string }> => {
    if (!email) {
        logger.error("checkUserExists called without email");
        throw new Error("Email is required.");
    }

    try {
        const user = await prisma.public_users.findFirst({
            where: {
                email: email,
            },
        });

        if (user && user.is_verified === false) {
            logger.info(`User ${email} exists but is not verified`);
            return { exist: true, error: "Please verify your email." };
        }

        logger.info(`User existence check completed for ${email}`);
        return user ? { exist: true } : { exist: false };
    } catch (error) {
        logger.error(
            `Error checking if user exists: ${error instanceof Error ? error.message : String(error)}`
        );
        throw error;
    }
};

export const signUpUser = async (
    credentials: UserCredentials
): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            logger.error(
                `Signup failed for ${credentials.email}: ${error.message}`
            );
            return { error: error.message };
        }

        logger.info(`User signup successful for ${credentials.email}`);
        return data;
    } catch (error) {
        logger.error(
            `Unexpected error during signup: ${error instanceof Error ? error.message : String(error)}`
        );
        throw error;
    }
};

export const loginUser = async (
    credentials: UserCredentials
): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            logger.warn(
                `Login failed for ${credentials.email}: ${error.message}`
            );
            return { error: "Incorrect password. Please try again." };
        }

        logger.info(`User login successful for ${credentials.email}`);
        return { user: data.user, session: data.session };
    } catch (error) {
        logger.error(
            `Unexpected error during login: ${error instanceof Error ? error.message : String(error)}`
        );
        throw error;
    }
};
