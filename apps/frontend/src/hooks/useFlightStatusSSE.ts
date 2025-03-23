import { useEffect } from "react";
import { useFlightStatusStore } from "@/store/flightStatusStore";

export function useFlightStatusSSE() {
    const updateStatus = useFlightStatusStore((s) => s.updateStatus);

    useEffect(() => {
        const es = new EventSource(
            "http://localhost:5001/api/flights/status/subscribe"
        );

        es.onmessage = (event) => {
            try {
                const { flightId, status } = JSON.parse(event.data);
                if (flightId && status) {
                    updateStatus(flightId, status);
                }
            } catch (e) {
                console.error("Invalid SSE message format:", event.data);
            }
        };

        es.onerror = (err) => {
            console.error("SSE connection error:", err);
            es.close(); // optional — close to avoid repeated errors
        };

        return () => {
            es.close();
        };
    }, [updateStatus]);
}
