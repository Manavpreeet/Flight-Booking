import { PrismaClient } from "@prisma/client";
import { io } from "../config/socket";
const prisma = new PrismaClient();

/**
 * Updates the flight status and stores it in the database.
 */
export const updateFlightStatus = async (
    flight_leg_id: string,
    status: string
) => {
    try {
        const validStatuses = ["on-time", "delayed", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error(
                `Invalid status. Allowed values: ${validStatuses.join(", ")}`
            );
        }

        // Update the flight leg status
        await prisma.flight_status_updates.create({
            data: {
                flight_leg_id,
                status,
                updated_at: new Date(),
            },
        });

        // Emit status update via WebSocket
        io.to(flight_leg_id).emit("flight-status-update", {
            flight_leg_id,
            status,
        });

        return { message: `Flight status updated to ${status}`, status };
    } catch (error: Error | any) {
        throw new Error(`Flight status update failed: ${error.message}`);
    }
};
