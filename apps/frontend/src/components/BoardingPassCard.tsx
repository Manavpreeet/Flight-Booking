// components/BoardingPassCard.tsx
import { motion } from "framer-motion";
import {
    FaPlaneDeparture,
    FaPlaneArrival,
    FaPlane,
    FaClock,
    FaSuitcaseRolling,
} from "react-icons/fa";

interface AirportInfo {
    code: string;
    city: string;
    name: string;
}

interface BoardingPassCardProps {
    segmentNumber: number;
    origin: AirportInfo;
    destination: AirportInfo;
    flightNumber: string;
    airline: string;
    departure: string;
    arrival: string;
    duration: number;
    layover?: number;
    status?: string;
    passengerSeats: {
        [passengerId: string]: {
            seat_number: string;
            cabin_class: string;
        };
    };
}

export default function BoardingPassCard({
    segmentNumber,
    origin,
    destination,
    flightNumber,
    airline,
    departure,
    arrival,
    duration,
    layover,
    status,
    passengerSeats,
}: BoardingPassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: segmentNumber * 0.1 }}
            className="bg-white shadow-lg rounded-xl overflow-hidden mb-6 border border-dashed"
        >
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500 font-medium">
                        Segment {segmentNumber}
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                        {status === "Delayed" ? "Delayed" : "On Time"}
                    </div>
                </div>

                {/* Route */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <FaPlaneDeparture className="text-indigo-600" />
                            {origin.code} - {origin.city}
                        </div>
                        <p className="text-sm text-gray-500">{origin.name}</p>
                        <p className="text-sm mt-1">
                            Departs: {new Date(departure).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <FaPlane className="text-xl text-gray-400 my-1" />
                        <p className="text-xs text-gray-500">{duration} mins</p>
                        {layover && (
                            <p className="text-xs text-red-500 mt-1">
                                Layover: {layover} min
                            </p>
                        )}
                    </div>

                    <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-lg font-bold">
                            {destination.code} - {destination.city}
                            <FaPlaneArrival className="text-indigo-600" />
                        </div>
                        <p className="text-sm text-gray-500">
                            {destination.name}
                        </p>
                        <p className="text-sm mt-1">
                            Arrives: {new Date(arrival).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Flight Info */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Flight: {airline} {flightNumber}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaClock />
                        Duration: {duration} min
                    </span>
                </div>

                {/* Passenger seats */}
                <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <FaSuitcaseRolling className="text-indigo-500" />
                        Passenger Seats
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(passengerSeats).map(
                            ([passengerId, seat]) => (
                                <div
                                    key={passengerId}
                                    className="border rounded px-3 py-1 bg-gray-50"
                                >
                                    {seat.cabin_class} - Seat {seat.seat_number}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
