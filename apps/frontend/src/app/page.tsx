"use client";

import FlightSearch from "@/components/FlightSearch";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFlightStatusSSE } from "@/hooks/useFlightStatusSSE";

export default function Home() {
    const { loginWithToken } = useAuth();
    useFlightStatusSSE();
    useEffect(() => {
        let urlExtracted = window.location.hash.split("#access_token=");

        if (urlExtracted.length > 1) {
            let token = urlExtracted[1].split("&")[0];
            if (token) {
                loginWithToken(token);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <div className="max-w-4xl mx-auto pt-10 space-y-8">
                <FlightSearch />
            </div>
        </div>
    );
}
