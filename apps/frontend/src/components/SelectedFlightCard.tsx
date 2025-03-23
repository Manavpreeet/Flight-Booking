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
    isConnecting: boolean;
    selectedFlight: {
        id?: string;
        flights?: FlightLeg["flights"];
        firstLeg?: FlightLeg;
        secondLeg?: FlightLeg;
    };
}

export const SelectedFlightCard: React.FC<SelectedFlightCardProps> = ({
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

            {isConnecting ? (
                <div className="space-y-4">
                    {[selectedFlight.firstLeg, selectedFlight.secondLeg].map(
                        (leg, idx) =>
                            leg ? (
                                <div
                                    key={leg.id}
                                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            Flight #{idx + 1}
                                        </p>
                                        <p className="font-semibold text-gray-700">
                                            {leg.flights.airline} —{" "}
                                            {leg.flights.flight_number}
                                        </p>
                                        <p className="text-gray-600 text-sm flex items-center gap-1">
                                            <FaPlaneDeparture className="text-green-500" />{" "}
                                            {leg.flights.origin} at{" "}
                                            {leg.flights.departure_time}
                                        </p>
                                        <p className="text-gray-600 text-sm flex items-center gap-1">
                                            <FaPlaneArrival className="text-red-500" />{" "}
                                            {leg.flights.destination} at{" "}
                                            {leg.flights.arrival_time}
                                        </p>
                                    </div>
                                </div>
                            ) : null
                    )}
                </div>
            ) : (
                selectedFlight.flights && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-semibold text-gray-700">
                            {selectedFlight.flights.airline} —{" "}
                            {selectedFlight.flights.flight_number}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                            <FaPlaneDeparture className="text-green-500" />{" "}
                            {
                                selectedFlight
                                    .airports_flight_legs_origin_airport_idToairports
                                    .code
                            }{" "}
                            at {selectedFlight.departure_time}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                            <FaPlaneArrival className="text-red-500" />{" "}
                            {
                                selectedFlight
                                    .airports_flight_legs_dest_airport_idToairports
                                    .code
                            }{" "}
                            at {selectedFlight.arrival_time}
                        </p>
                    </div>
                )
            )}
        </motion.div>
    );
};
