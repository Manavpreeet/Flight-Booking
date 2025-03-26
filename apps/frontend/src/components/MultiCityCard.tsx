"use client";

import { motion } from "framer-motion";
import { FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { format, differenceInDays } from "date-fns";
import { useFlightStatusStore } from "@/store/flightStatusStore";

function FlightSegmentCard({
    origin,
    destination,
    departureTime,
    arrivalTime,
    airline,
    flightNumber,
    flightLegId,
    onChangeDate,
    status,
}: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    airline: string;
    flightNumber: string;
    flightLegId: string;
    onChangeDate?: () => void;
    status: string;
}) {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const today = new Date();
    const inDays = differenceInDays(departure, today);

    const liveFlightStatus = useFlightStatusStore(
        (s) => s.statusMap[flightLegId] ?? "On-Time"
    );

    const statusTag =
        status === "Cancelled"
            ? "Cancelled"
            : status === "Completed"
              ? "Completed"
              : inDays === 0
                ? "Today"
                : `In ${inDays} Day${inDays > 1 ? "s" : ""}`;

    return (
        <div className="space-y-2">
            <div className="text-sm text-gray-700 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>{format(departure, "dd MMM ''yy hh:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{format(arrival, "dd MMM ''yy hh:mm a")}</span>
                </div>
                <div>
                    <span className="font-medium">Airline:</span> {airline}{" "}
                    {flightNumber}
                </div>
            </div>
            <div>
                <span className="font-medium">From:</span> {origin} at{" "}
                {new Date(departureTime).toLocaleString()}
            </div>
            <div>
                <span className="font-medium">To:</span> {destination} at{" "}
                {new Date(arrivalTime).toLocaleString()}
            </div>

            {status === "Confirmed" && (
                <div className="flex justify-end">
                    <button
                        onClick={onChangeDate}
                        className="flex items-center gap-2 text-blue-500 hover:underline text-sm"
                    >
                        <FiEdit2 /> Change Date
                    </button>
                </div>
            )}
        </div>
    );
}

export default function MultiCityBookingCard({
    bookingId,
    passengerCount,
    status,
    onCancel,
    segments,
    onManage,
}: {
    bookingId: string;
    passengerCount: number;
    status: "Confirmed" | "Cancelled" | "Completed" | "Modified";
    onCancel?: () => void;
    onManage?: () => void;
    segments: {
        origin: string;
        destination: string;
        departureTime: string;
        arrivalTime: string;
        airline: string;
        flightNumber: string;
        flightLegId: string;
        onChangeDate?: () => void;
    }[];
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border p-5 shadow-sm bg-white space-y-6 text-gray-800"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Multi-City Booking</h2>
                <span className="text-sm text-gray-600">
                    <FaUser className="inline-block mr-1" /> {passengerCount}{" "}
                    Passengers
                </span>
            </div>

            {segments.map((seg, idx) => (
                <FlightSegmentCard key={idx} {...seg} status={status} />
            ))}

            <button
                onClick={onManage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow hover:brightness-105"
            >
                View Booking
            </button>

            {status === "Confirmed" && (
                <div className="border-t pt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        <span>✓</span> Is subjected to a cancellation penalty
                    </span>
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 text-red-500 hover:underline"
                    >
                        <FiTrash2 /> Cancel Booking
                    </button>
                </div>
            )}
        </motion.div>
    );
}
