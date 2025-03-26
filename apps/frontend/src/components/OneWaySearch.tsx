"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FiArrowRight, FiCalendar, FiSearch } from "react-icons/fi";
import { IoAirplaneOutline } from "react-icons/io5";
import DepartureDatePicker from "./DeparDatePicker";
import SearchButton from "./SearchButton";

type Airport = { code: string; name: string; city: string };

export default function OneWaySearch({
    airports,
    onSearch,
    isVisible,
    seatType,
}: {
    airports: Airport[];
    onSearch: (data: {
        origin: string;
        destination: string;
        departureDate: string;
    }) => void;
    isVisible: boolean;
    seatType: string;
}) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [error, setError] = useState("");

    const today = format(new Date(), "yyyy-MM-dd");

    const handleSearch = async (data: any) => {
        if (!origin || !destination || !departureDate) {
            return setError("All fields are required.");
        }

        if (origin === destination) {
            return setError("Origin and destination can't be the same.");
        }

        if (departureDate < today) {
            return setError("Departure date can't be in the past.");
        }

        setError("");
        onSearch({ origin, destination, departureDate });
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="oneway-search"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl p-6 w-full max-w-3xl mx-auto mt-8 space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-blue-600 text-xl font-bold"
                    >
                        <IoAirplaneOutline /> One-Way Flight Search
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                From
                            </label>
                            <select
                                className="w-full rounded-md border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            >
                                <option value="">Select Origin</option>
                                {airports.map((airport) => {
                                    if (destination !== airport.code) {
                                        return (
                                            <option
                                                key={airport.code}
                                                value={airport.code}
                                            >
                                                {airport.city} ({airport.code})
                                                — {airport.name}
                                            </option>
                                        );
                                    }
                                })}
                            </select>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                To
                            </label>
                            <select
                                className="w-full rounded-md border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            >
                                <option value="">Select Destination</option>
                                {airports.map((airport) => {
                                    if (origin !== airport.code) {
                                        return (
                                            <option
                                                key={airport.code}
                                                value={airport.code}
                                            >
                                                {airport.city} ({airport.code})
                                                — {airport.name}
                                            </option>
                                        );
                                    }
                                })}
                            </select>
                        </motion.div>

                        <DepartureDatePicker
                            origin={origin}
                            destination={destination}
                            selectedDate={departureDate}
                            onDateChange={setDepartureDate}
                            seatType={seatType}
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-red-500 text-sm font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <SearchButton
                        origin={origin}
                        destination={destination}
                        departureDate={departureDate}
                        onSearch={handleSearch}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
