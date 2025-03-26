"use client";

import { motion } from "framer-motion";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { MdFlight } from "react-icons/md";

interface FlightLeg {
    id: string;
    airports_flight_legs_dest_airport_idToairports: any;
    airports_flight_legs_origin_airport_idToairports: any;
    flights: {
        flight_number: string;
        airline: string;
        departure_time: string;
        arrival_time: string;
    };
}

interface SelectedFlightCardProps {
    flightNumber: number;
    isConnecting: boolean;
    selectedFlight: {
        id?: string;
        flights?: FlightLeg["flights"];
        firstLeg?: FlightLeg;
        secondLeg?: FlightLeg;
    };
}

export const SelectedFlightCard: React.FC<SelectedFlightCardProps> = ({
    flightNumber,
    isConnecting,
    selectedFlight,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md border"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <MdFlight className="text-blue-500" /> Selected Flight
                </h2>
                <span className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full">
                    {isConnecting ? "Connecting Flight" : "Direct Flight"}
                </span>
            </div>

            <div className="space-y-4">
                {selectedFlight.map((leg, idx) =>
                    leg ? (
                        <div
                            key={leg.id}
                            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                        >
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">
                                    Flight #{flightNumber}
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {leg.flight.airline.name} —{" "}
                                    {leg.flight.flight_number}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                    <FaPlaneDeparture className="text-green-500" />{" "}
                                    {leg.origin_airport.code} at{" "}
                                    {leg.departure_time}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                    <FaPlaneArrival className="text-red-500" />{" "}
                                    {leg.destination_airport.code} at{" "}
                                    {leg.arrival_time}
                                </p>
                            </div>
                        </div>
                    ) : null
                )}
            </div>
        </motion.div>
    );
};
