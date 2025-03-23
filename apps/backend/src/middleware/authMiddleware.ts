import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

/**
 * Middleware to verify Supabase authentication token.
 */
export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Token:", token);
        if (!token) {
            res.status(401).json({ error: "Unauthorized: No token provided." });
            return;
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            res.status(401).json({
                error: "Unauthorized: Invalid or expired token.",
            });
            return;
        }

        req.user = { ...data.user, token: token };

        next();
    } catch (error) {
        res.status(500).json({
            error: "Server error: Failed to authenticate token.",
        });
    }
};
