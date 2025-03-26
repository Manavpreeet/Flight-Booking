"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import DepartureDatePicker from "./DeparDatePicker";
import SearchButton from "./SearchButton";
import toast from "react-hot-toast";

type Airport = { code: string; name: string; city: string };
type Segment = { origin: string; destination: string; date: string };

export default function MultiCitySearch({
    airports,
    onSearch,
    isVisible,
    seatType,
}: {
    airports: Airport[];
    onSearch: (segments: Segment[]) => Promise<void>;
    isVisible: boolean;
    seatType: string;
}) {
    const today = format(new Date(), "yyyy-MM-dd");

    const [segments, setSegments] = useState<Segment[]>([
        { origin: "", destination: "", date: "" },
    ]);

    const [error, setError] = useState("");

    const updateSegment = (
        index: number,
        field: keyof Segment,
        value: string
    ) => {
        const updated = [...segments];
        updated[index][field] = value;

        // If changing destination and there's a next segment, auto-fill its origin
        if (
            field === "destination" &&
            index < segments.length - 1 &&
            updated[index + 1].origin !== value
        ) {
            updated[index + 1].origin = value;
        }

        setSegments(updated);
    };

    const addSegment = () => {
        if (segments.length >= 5) return;

        const last = segments[segments.length - 1];
        setSegments([
            ...segments,
            {
                origin: last.destination || "",
                destination: "",
                date: last.date || "",
            },
        ]);
    };

    const removeSegment = (index: number) => {
        setSegments((prev) => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        if (segments.some((s) => !s.origin || !s.destination || !s.date)) {
            toast.error("Please fill all segment fields.");
            return false;
        }

        for (let i = 0; i < segments.length; i++) {
            if (segments[i].origin === segments[i].destination) {
                toast.error(
                    `Origin and destination cannot be the same in segment ${i + 1}`
                );
                return false;
            }

            if (segments[i].date < today) {
                toast.error(`Segment ${i + 1}: date can't be in the past.`);
                return false;
            }

            if (i > 0 && segments[i].date < segments[i - 1].date) {
                toast.error(
                    `Segment ${i + 1} date can't be before segment ${i}`
                );
                return false;
            }

            if (i > 0 && segments[i].origin !== segments[i - 1].destination) {
                toast.error(
                    `Segment ${i + 1} origin must match segment ${i} destination`
                );
                return false;
            }
        }

        return true;
    };

    const handleSearch = () => {
        if (!validate()) return;
        console.log("Segments", segments);
        onSearch(segments);
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="multicity-search"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl p-6 w-full max-w-4xl mx-auto mt-8 space-y-6"
                >
                    <motion.div
                        className="text-blue-600 text-xl font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        ✈ Multi-City Flight Search
                    </motion.div>

                    {/* Flight Segments */}
                    <div className="space-y-6">
                        {segments.map((segment, index) => (
                            <motion.div
                                key={index}
                                layout
                                className="bg-gray-50 border rounded-md p-4 shadow-sm space-y-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-700">
                                        Segment {index + 1}
                                    </h4>
                                    {segments.length > 1 && (
                                        <button
                                            onClick={() => removeSegment(index)}
                                            className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                                        >
                                            <FiTrash2 /> Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Origin */}
                                    <div>
                                        <label className="block text-sm mb-1">
                                            From
                                        </label>
                                        <select
                                            value={segment.origin}
                                            onChange={(e) =>
                                                updateSegment(
                                                    index,
                                                    "origin",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-3 border rounded-md"
                                        >
                                            <option value="">
                                                Select Origin
                                            </option>
                                            {airports.map((a) => (
                                                <option
                                                    key={a.code}
                                                    value={a.code}
                                                >
                                                    {a.city} ({a.code}) –{" "}
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <label className="block text-sm mb-1">
                                            To
                                        </label>
                                        <select
                                            value={segment.destination}
                                            onChange={(e) =>
                                                updateSegment(
                                                    index,
                                                    "destination",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full p-3 border rounded-md"
                                        >
                                            <option value="">
                                                Select Destination
                                            </option>
                                            {airports.map((a) => (
                                                <option
                                                    key={a.code}
                                                    value={a.code}
                                                >
                                                    {a.city} ({a.code}) –{" "}
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <DepartureDatePicker
                                    selectedDate={segment.date}
                                    onDateChange={(date) =>
                                        updateSegment(index, "date", date)
                                    }
                                    title={undefined}
                                    seatType={seatType}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Add Flight Button */}
                    {segments.length < 5 && (
                        <button
                            onClick={addSegment}
                            className="flex items-center gap-2 text-sky-600 hover:underline"
                        >
                            <FiPlus /> Add Another Segment
                        </button>
                    )}

                    <SearchButton
                        origin={segments[0].origin}
                        destination={segments[segments.length - 1].destination}
                        departureDate={segments[0].date}
                        onSearch={handleSearch}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
