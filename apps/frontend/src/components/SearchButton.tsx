"use client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";

type Props = {
    origin: string;
    destination: string;
    departureDate: string;
    onSearch: (data: any) => Promise<void>;
};

export default function SearchButton({
    origin,
    destination,
    departureDate,
    onSearch,
}: Props) {
    const [loading, setLoading] = useState(false);
    const today = format(new Date(), "yyyy-MM-dd");

    const validate = () => {
        if (!origin || !destination || !departureDate) {
            toast.error("Please fill all fields.");
            return false;
        }
        if (origin === destination) {
            toast.error("Origin and destination must be different.");
            return false;
        }
        if (departureDate < today) {
            toast.error("Departure date must be today or later.");
            return false;
        }

        return true;
    };

    const handleClick = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await onSearch({
                origin,
                destination,
                departureDate,
            });
        } catch (err) {
            toast.error("Failed to search. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            ) : (
                <>
                    <FiSearch />
                    Search Flights
                </>
            )}
        </motion.button>
    );
}
