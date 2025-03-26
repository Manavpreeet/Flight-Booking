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
export interface Passenger {
    name: string;
    age: string;
    passenger_type: "Adult" | "Child" | "Infant";
    is_disabled?: boolean;
    errors?: {
        name?: string;
        age?: string;
    };
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
    passengers,
    setPassengers,
    errors,
}) => {
    const validatePassenger = (passenger: Passenger): Passenger["errors"] => {
        const errors: Passenger["errors"] = {};
        const age = parseInt(passenger.age);

        if (!passenger.name.trim()) {
            errors.name = "Name is required";
        }

        if (isNaN(age)) {
            errors.age = "Age must be a number";
        } else {
            switch (passenger.passenger_type) {
                case "Adult":
                    if (age < 12) errors.age = "Adult must be 12 or older";
                    break;
                case "Child":
                    if (age < 2 || age > 11)
                        errors.age = "Child age must be between 2 and 11";
                    break;
                case "Infant":
                    if (age >= 2) errors.age = "Infant must be younger than 2";
                    break;
            }
        }

        return errors;
    };

    const handleChange = (
        index: number,
        field: keyof Passenger,
        value: string
    ) => {
        const updated = [...passengers];
        const errors = validatePassenger(updated[index]);

        if (field == "age" && parseInt(value) < 2) return;
        updated[index][field] = value;
        updated[index].errors = errors;
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
                    {passenger.errors?.name && (
                        <p className="text-red-500 text-sm">
                            {passenger.errors.name}
                        </p>
                    )}
                    <input
                        type="number"
                        placeholder="Age"
                        value={passenger.age}
                        onChange={(e) =>
                            handleChange(index, "age", e.target.value)
                        }
                        className="border p-2 rounded-md w-full md:w-1/3"
                    />
                    {passenger.errors?.age && (
                        <p className="text-red-500 text-sm">
                            {passenger.errors.age}
                        </p>
                    )}
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
