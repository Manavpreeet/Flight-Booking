"use client";

import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";

interface FareSummarySidebarProps {
    baseFare: number;
    taxes: number;
}

export const FareSummarySidebar: React.FC<FareSummarySidebarProps> = ({
    baseFare,
    taxes,
}) => {
    const totalAmount = baseFare + taxes;

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md border w-full md:w-80"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaRupeeSign className="text-green-500" /> Fare Summary
            </h2>

            <div className="text-gray-700 space-y-3">
                <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹ {baseFare.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                    <span>Taxes & Surcharges</span>
                    <span>₹ {taxes.toLocaleString()}</span>
                </div>

                <hr className="my-3 border-gray-300" />

                <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹ {totalAmount.toLocaleString()}</span>
                </div>
            </div>
        </motion.div>
    );
};
