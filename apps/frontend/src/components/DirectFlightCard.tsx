"use client";
import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiUserCheck } from "react-icons/fi";
import { IoAirplaneOutline } from "react-icons/io5";

export default function DirectFlightCard({
    flight,
    seats,
    onBook,
    isSelected,
}: any) {
    const minPrice = seats?.[0]?.price || "N/A";

    console.log(flight, "DirectFlightCard");
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-4  ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        ✈ Flight {flight.flight_number} from{" "}
                        {flight.origin_airport.code} to{" "}
                        {flight.destination_airport.code}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Airline: {flight.flight.airline?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiClock /> Status: {flight.flight.status}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-600">
                        Seats: {flight.flight.available_seats}
                    </p>
                    <p className="text-green-600 font-bold mt-1">
                        Starting at ₹{minPrice}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                    <span className="font-semibold">Departure</span>:{" "}
                    {new Date(flight.departure_time).toLocaleTimeString()}
                </div>
                <div>
                    <span className="font-semibold">Arrival</span>:{" "}
                    {new Date(flight.arrival_time).toLocaleTimeString()}
                </div>
            </div>

            <button
                onClick={onBook}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
            >
                ✅ Book Now
            </button>
        </motion.div>
    );
}
