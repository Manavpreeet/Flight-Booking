"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

export interface Passenger {
    name: string;
    age: string;
    passenger_type: "Adult" | "Child" | "Infant";
    is_disabled?: boolean;
}

interface PassengerFormProps {
    passengers: Passenger[];
    setPassengers: (p: Passenger[]) => void;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
    passengers,
    setPassengers,
}) => {
    const handleChange = (
        index: number,
        field: keyof Passenger,
        value: string
    ) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md border text-gray-700"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Passenger Details
            </h2>

            {passengers.map((passenger, index) => (
                <motion.div
                    key={index}
                    layout
                    className="flex flex-col md:flex-row gap-4 mt-4"
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={passenger.name}
                        onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                        }
                        className="border p-2 rounded-md w-full md:w-1/3"
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={passenger.age}
                        onChange={(e) =>
                            handleChange(index, "age", e.target.value)
                        }
                        className="border p-2 rounded-md w-full md:w-1/3"
                    />
                    <select
                        value={passenger.passenger_type}
                        disabled={passenger.is_disabled}
                        onChange={(e) =>
                            handleChange(
                                index,
                                "passenger_type",
                                e.target.value
                            )
                        }
                        className="border p-2 rounded-md w-full md:w-1/3"
                    >
                        <option value="Adult">Adult</option>
                        <option value="Child">Child</option>
                        <option value="Infant">Infant</option>
                    </select>
                </motion.div>
            ))}
        </motion.div>
    );
};
