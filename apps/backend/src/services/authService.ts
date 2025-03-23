import { supabase } from "../config/supabase";
import { AuthResponse, UserCredentials } from "../types/authTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Check if a user exists in Supabase Auth.
 */
export const checkUserExists = async (
    email: string
): Promise<{ exist: boolean; error?: string }> => {
    if (!email) {
        throw new Error("Email is required.");
    }

    const user = await prisma.public_users.findFirst({
        where: {
            email: email,
        },
    });

    if (user && user.is_verified === false) {
        return { exist: true, error: "Please verify your email." };
    }

    return user ? { exist: true } : { exist: false };
};

/**
 * Sign up a new user in Supabase Auth.
 */
export const signUpUser = async (
    credentials: UserCredentials
): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        return { error: error.message };
    }

    return data;
};

/**
 * Login an existing user.
 */
export const loginUser = async (
    credentials: UserCredentials
): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        return { error: "Incorrect password. Please try again." };
    }

    return { user: data.user, session: data.session };
};
