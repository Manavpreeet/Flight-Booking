"use strict";

import Navbar from "@/components/Navbar";
import FlightSearch from "@/components/FlightSearch";
import UpcomingFlights from "@/components/UpcomingFlights";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 space-y-8">
                <FlightSearch />
                <UpcomingFlights />
            </div>
        </div>
    );
}
