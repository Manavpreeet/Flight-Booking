import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface SSEClient {
    id: string;
    response: Response;
}

const clients: SSEClient[] = [];

// ✅ SSE: Subscribe to real-time flight status updates
export const subscribeToFlightStatus = (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const clientId = `client-${Date.now()}`;
    clients.push({ id: clientId, response: res });

    console.log(`New SSE client connected: ${clientId}`);

    req.on("close", () => {
        clients.splice(
            clients.findIndex((client) => client.id === clientId),
            1
        );
        console.log(`Client disconnected: ${clientId}`);
    });
};

// ✅ SSE: Broadcast flight status update
const broadcastFlightStatusUpdate = (flightId: string, status: string) => {
    clients.forEach((client) => {
        client.response.write(
            `data: ${JSON.stringify({ flightId, status })}\n\n`
        );
    });
};

// ✅ API: Update flight status (Triggers SSE Broadcast)
export const updateFlightStatus = async (req: Request, res: Response) => {
    const { flightId, status } = req.body;

    if (!flightId || !status) {
        res.status(400).json({ error: "Missing flightId or status" });
        return;
    }

    // Update flight status in the database (Example: Supabase)
    try {
        const flightLeg = await prisma.flight_legs.findUnique({
            where: { id: flightId },
            include: { flight_status_updates: true },
        });

        if (!flightLeg) {
            res.status(400).json({ error: "Invalid flightId" });
            return;
        }
        let data: {
            id: string;
            status: string;
            flight_leg_id: string;
            updated_at: Date | null;
        } | null = null;
        if (flightLeg.flight_status_updates.length == 0) {
            data = await prisma.flight_status_updates.create({
                data: { status: status, flight_leg_id: flightId },
            });
        } else {
            data = await prisma.flight_status_updates.update({
                where: { id: flightLeg.flight_status_updates[0].id },
                data: { status: status },
            });
        }

        console.log(`Flight ${flightId} status updated to: ${status}`);

        // Broadcast update to all SSE clients
        broadcastFlightStatusUpdate(flightId, status);

        res.status(200).json({ message: "Flight status updated successfully" });
        return;
    } catch (err) {
        console.error("Error updating flight status:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
