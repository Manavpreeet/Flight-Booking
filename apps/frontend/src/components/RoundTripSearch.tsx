"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { IoRepeatOutline } from "react-icons/io5";
import DepartureDatePicker from "./DeparDatePicker";
import SearchButton from "./SearchButton";

type Airport = { code: string; name: string; city: string };

export default function RoundTripSearch({
    airports,
    onSearch,
    isVisible,
}: {
    airports: Airport[];
    onSearch: (data: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate: string;
    }) => void;
    isVisible: boolean;
}) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [error, setError] = useState("");

    const today = format(new Date(), "yyyy-MM-dd");

    const handleSearch = () => {
        if (!origin || !destination || !departureDate || !returnDate) {
            return setError("All fields are required.");
        }

        if (origin === destination) {
            return setError("Origin and destination can't be the same.");
        }

        if (departureDate < today) {
            return setError("Departure date must be today or later.");
        }

        if (returnDate < departureDate) {
            return setError("Return date must be after departure date.");
        }

        setError("");
        onSearch({ origin, destination, departureDate, returnDate });
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="roundtrip-search"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl p-6 w-full max-w-3xl mx-auto mt-8 space-y-6"
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-blue-600 text-xl font-bold"
                    >
                        <IoRepeatOutline /> Round Trip Flight Search
                    </motion.div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Origin */}
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
                                {airports.map((airport) => (
                                    <option
                                        key={airport.code}
                                        value={airport.code}
                                    >
                                        {airport.city} ({airport.code}) —{" "}
                                        {airport.name}
                                    </option>
                                ))}
                            </select>
                        </motion.div>

                        {/* Destination */}
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
                                {airports.map((airport) => (
                                    <option
                                        key={airport.code}
                                        value={airport.code}
                                    >
                                        {airport.city} ({airport.code}) —{" "}
                                        {airport.name}
                                    </option>
                                ))}
                            </select>
                        </motion.div>

                        {/* Departure */}
                        <DepartureDatePicker
                            origin={origin}
                            destination={destination}
                            selectedDate={departureDate}
                            onDateChange={setDepartureDate}
                        />

                        {/* Return */}
                        <DepartureDatePicker
                            destination={origin}
                            origin={destination}
                            selectedDate={returnDate}
                            onDateChange={setReturnDate}
                            hiddenFromDate={new Date(departureDate)}
                            title="Return Date"
                        />
                    </div>

                    {/* Error display */}
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

                    {/* Search Button */}
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
