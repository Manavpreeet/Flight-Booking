"use client";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiUser, FiCheckCircle } from "react-icons/fi";
import { IoAirplaneOutline } from "react-icons/io5";
import { ImStopwatch } from "react-icons/im";

type Props = {
    connection: {
        legs: any[];
    };
    onBook: () => void;
    isSelected?: boolean;
};

export default function ConnectingFlightCard({
    connection,
    onBook,
    isSelected,
}: Props) {
    const { legs } = connection;

    const getTotalPrice = (flight: any) =>
        (Array.isArray(flight.legs) ? flight.legs : [flight]).reduce(
            (sum: number, leg: any) =>
                sum + parseInt(leg.flight_seats?.[0]?.price || "0"),
            0
        );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6
                
                ${isSelected ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}
                `}
        >
            <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
                <IoAirplaneOutline /> Connecting Flight — {legs.length} Leg
                {legs.length > 1 && "s"}
            </div>

            {legs.map((leg, index) => {
                const origin =
                    leg.airports_flight_legs_origin_airport_idToairports;
                const dest = leg.airports_flight_legs_dest_airport_idToairports;
                const flight = leg.flights;
                const seat = leg.flight_seats?.[0];

                return (
                    <div key={leg.id}>
                        <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <div className="text-gray-700 font-semibold flex items-center gap-2">
                                    <IoAirplaneOutline />{" "}
                                    {flight.airlines?.name} (
                                    {flight.flight_number})
                                </div>
                                <div className="text-xs text-gray-500">
                                    Status: {flight.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                    <p className="flex items-center gap-1">
                                        <FiMapPin /> From: {origin?.city} (
                                        {origin?.code})
                                    </p>
                                    <p>
                                        🕒{" "}
                                        {new Date(
                                            leg.departure_time
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="flex items-center gap-1">
                                        <FiMapPin /> To: {dest?.city} (
                                        {dest?.code})
                                    </p>
                                    <p>
                                        🕒{" "}
                                        {new Date(
                                            leg.arrival_time
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 flex justify-between items-center mt-2">
                                <span className="flex items-center gap-1">
                                    <FiClock /> Duration: {leg.duration} mins
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiUser /> Seats: {flight.available_seats}
                                </span>
                                <span>₹{seat?.price || "N/A"}</span>
                            </div>
                        </div>
                        {/* Show layover if next leg exists */}
                        {index < legs.length - 1 && (
                            <div className="text-center mt-4 text-sm text-gray-500 border-t pt-3 flex justify-center items-center gap-2">
                                <ImStopwatch /> Layover:{" "}
                                {legs[index + 1]?.layover_time || "?"} mins
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                onClick={onBook}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold flex justify-center items-center gap-2"
            >
                <FiCheckCircle /> Book Full Journey for Rs.
                {getTotalPrice(connection)}
            </button>
        </motion.div>
    );
}
