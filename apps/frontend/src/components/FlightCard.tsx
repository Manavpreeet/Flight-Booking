// components/FlightCard.tsx
import { useFlightStatusSSE } from "@/hooks/useFlightStatusSSE";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    flightLegId: string;
    airline: string;
    departure: string;
    arrival: string;
    baseStatus?: string; // fallback from server render
};

export default function FlightCard({
    flightLegId,
    airline,
    departure,
    arrival,
    baseStatus = "On-Time",
}: Props) {
    const [liveStatus, setLiveStatus] = useState(baseStatus);

    useFlightStatusSSE(({ flightId, status }) => {
        if (flightId === flightLegId) {
            setLiveStatus(status);
        }
    });

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white space-y-2">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">{airline}</div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={liveStatus}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className={`text-sm px-2 py-1 rounded-md font-medium ${
                            liveStatus === "Delayed"
                                ? "bg-yellow-100 text-yellow-800"
                                : liveStatus === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                        }`}
                    >
                        {liveStatus}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="text-sm text-gray-600">
                <div>Departure: {departure}</div>
                <div>Arrival: {arrival}</div>
            </div>
        </div>
    );
}
