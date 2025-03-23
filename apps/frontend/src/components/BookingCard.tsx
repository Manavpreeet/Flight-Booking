// components/BookingCard.tsx
"use client";

import { motion } from "framer-motion";
import {
    FaPlaneDeparture,
    FaUser,
    FaCalendarAlt,
    FaClock,
} from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { format, differenceInDays } from "date-fns";
import { useFlightStatusSSE } from "@/hooks/useFlightStatusSSE";
import { useState } from "react";
import { useFlightStatusStore } from "@/store/flightStatusStore";

type BookingCardProps = {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    airline: string;
    flightNumber: string;
    passengerCount: number;
    tripType: "one-way" | "round-trip";
    bookingId: string;
    status: "Confirmed" | "Cancelled" | "Completed";
    onCancel?: () => void;
    onChangeDate?: () => void;
    onManage?: () => void;
    flightLegId: string; // NEW prop required
};

export default function BookingCard({
    origin,
    destination,
    departureTime,
    arrivalTime,
    airline,
    flightNumber,
    passengerCount,
    tripType,
    bookingId,
    status,
    onCancel,
    onChangeDate,
    onManage,
    flightLegId,
}: BookingCardProps) {
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
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border p-5 shadow-sm bg-white space-y-4 text-gray-800"
        >
            <span
                className={`text-xs font-medium px-2 py-1 rounded-full ml-2 ${
                    liveFlightStatus === "Delayed"
                        ? "bg-yellow-100 text-yellow-800"
                        : liveFlightStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                }`}
            >
                {liveFlightStatus}
            </span>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FaPlaneDeparture className="text-xl text-blue-500" />
                    <h2 className="text-lg font-semibold">
                        {origin} → {destination}
                    </h2>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {statusTag}
                    </span>
                </div>
                <button
                    onClick={onManage}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow hover:brightness-105"
                >
                    {status == "Confirmed"
                        ? "View & Manage Booking"
                        : "View Booking"}
                </button>
            </div>

            <div className="text-sm text-gray-700 flex flex-wrap gap-4">
                <div>
                    <span className="font-medium">Trip:</span>{" "}
                    {tripType === "one-way" ? "One Way" : "Round Trip"}
                </div>
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>{format(departure, "dd MMM ''yy hh:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{format(arrival, "dd MMM ''yy hh:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <span>{passengerCount}</span>
                </div>
                <div>
                    <span className="font-medium">Airline:</span> {airline}{" "}
                    {flightNumber}
                </div>
            </div>

            {status == "Confirmed" && (
                <div className="border-t pt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        <span>✓</span> Is subjected to a cancellation penalty
                    </span>
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex items-center gap-2 text-red-500 hover:underline"
                        >
                            <FiTrash2 /> Cancel Booking
                        </button>
                        <button
                            onClick={onChangeDate}
                            className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                            <FiEdit2 /> Change Travel Dates
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
