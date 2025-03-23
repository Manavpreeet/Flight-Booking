"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    currentClass: string;
    availableClasses: string[];
    onModified: () => void;
};

export default function ChangeSeatClassModal({
    isOpen,
    onClose,
    bookingId,
    currentClass,
    availableClasses,
    onModified,
}: Props) {
    const [selected, setSelected] = useState(currentClass);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (selected === currentClass) {
            toast("Already selected!");
            return;
        }

        setLoading(true);
        try {
            await axios.patch(`/bookings/modify/${bookingId}`, {
                seat_class: selected,
            });
            toast.success("Seat class updated");
            onClose();
            onModified();
        } catch (err) {
            toast.error("Failed to update seat class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
                >
                    <Dialog.Title className="text-lg font-semibold mb-4">
                        Change Seat Class
                    </Dialog.Title>

                    <div className="space-y-2">
                        {availableClasses.map((cls) => (
                            <label
                                key={cls}
                                className={`flex items-center justify-between px-4 py-2 border rounded-lg cursor-pointer ${
                                    selected === cls
                                        ? "bg-blue-100 border-blue-500"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <span className="capitalize">{cls}</span>
                                <input
                                    type="radio"
                                    name="seat_class"
                                    value={cls}
                                    checked={selected === cls}
                                    onChange={() => setSelected(cls)}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            className="text-gray-600 px-4 py-2 hover:underline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Change Class"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </Dialog>
    );
}
