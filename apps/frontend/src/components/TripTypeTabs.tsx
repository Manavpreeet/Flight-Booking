import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tripOptions = ["one-way", "round-trip", "multi-city"];

export default function TripTypeTabs({
    selectedType,
    onChange,
}: {
    selectedType: string;
    onChange: (type: string) => void;
}) {
    return (
        <div className="flex items-center space-x-4 bg-white p-2 rounded-xl shadow-sm w-fit">
            {tripOptions.map((type) => (
                <button
                    key={type}
                    onClick={() => onChange(type)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all
                        ${
                            selectedType === type
                                ? "text-white bg-sky-600 shadow"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {type === "one-way"
                        ? "One Way"
                        : type === "round-trip"
                          ? "Round Trip"
                          : "Multi City"}
                </button>
            ))}
        </div>
    );
}
