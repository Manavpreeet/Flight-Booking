"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";

type ClassType = "Economy" | "Premium Economy" | "Business" | "First";

export default function TravellerClassSelector({
    travellers,
    setTravellers,
    cabinClass,
    setCabinClass,
}: {
    travellers: { adults: number; children: number; infants: number };
    setTravellers: (val: {
        adults: number;
        children: number;
        infants: number;
    }) => void;
    cabinClass: ClassType;
    setCabinClass: (val: ClassType) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const total = travellers.adults + travellers.children + travellers.infants;

    const updateCount = (type: keyof typeof travellers, delta: number) => {
        setTravellers((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta),
        }));
    };

    return (
        <div
            ref={ref}
            className="relative rounded-xl bg-white mx-auto p-6 text-gray-700"
        >
            <label className="block mb-1 text-sm font-medium text-gray-700">
                Travellers & Class
            </label>

            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                <span>
                    {total} Traveller{total > 1 ? "s" : ""} | {cabinClass}
                </span>
                {open ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 bg-white shadow-lg rounded-md p-4 mt-2 w-full space-y-4"
                    >
                        {["adults", "children", "infants"].map((type) => (
                            <div
                                key={type}
                                className="flex justify-between items-center"
                            >
                                <p className="capitalize">{type}</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateCount(type as any, -1)
                                        }
                                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span>
                                        {
                                            travellers[
                                                type as keyof typeof travellers
                                            ]
                                        }
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateCount(type as any, 1)
                                        }
                                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div>
                            <p className="font-medium mb-1">Cabin Class</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Economy",
                                    "Premium Economy",
                                    "Business",
                                    "First",
                                ].map((cls) => (
                                    <button
                                        key={cls}
                                        onClick={() =>
                                            setCabinClass(cls as ClassType)
                                        }
                                        className={`px-3 py-2 border rounded-md text-sm ${
                                            cabinClass === cls
                                                ? "bg-sky-600 text-white border-sky-600"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {cls}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
