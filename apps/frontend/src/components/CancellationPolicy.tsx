"use client";

import { motion } from "framer-motion";
import { MdPolicy } from "react-icons/md";

export const CancellationPolicy: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md border"
        >
            <div className="flex items-center gap-2 mb-4">
                <MdPolicy className="text-orange-500 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                    Cancellation & Change Policy
                </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                The following charges apply based on when you cancel your
                flight. This policy is fixed and cannot be modified after
                booking.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-700">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="font-bold text-green-600">
                        Up to 2 hrs before departure
                    </p>
                    <p>₹ 4,575 cancellation fee</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="font-bold text-yellow-600">
                        Between 2 hrs and departure
                    </p>
                    <p>₹ 7,881 cancellation fee</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="font-bold text-red-600">After departure</p>
                    <p>Non-refundable</p>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                * Refunds (if any) will be processed back to your original
                payment method.
            </p>
        </motion.div>
    );
};
