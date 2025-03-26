"use client";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useFareCalendar } from "@/hooks/useFareCalendar";

export default function DepartureDatePicker({
    seatType,
    selectedDate,
    onDateChange,
    hiddenFromDate,
    title,
    origin,
    destination,
}: {
    title?: string;
    selectedDate: string;
    onDateChange: (date: string) => void;
    hiddenFromDate?: Date;
    origin: string;
    destination: string;
    seatType: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const today = new Date();

    const selected = selectedDate ? new Date(selectedDate) : undefined;

    const { fareMap, minPrice, maxPrice } = useFareCalendar(
        origin,
        destination,
        seatType
    );

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

    // 🎨 Heatmap logic
    const getPriceColor = (price: number) => {
        if (minPrice === null || maxPrice === null) return "text-gray-500";
        const range = maxPrice - minPrice;
        const percent = (price - minPrice) / (range || 1);

        if (percent < 0.33) return "text-green-600";
        if (percent < 0.66) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div ref={ref} className="relative w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {title || "Departure Date"}
            </label>

            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full border border-gray-300 rounded-md p-3 text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                <span>
                    {selectedDate
                        ? format(new Date(selectedDate), "dd MMM yyyy (EEE)")
                        : "Select Date"}
                </span>
                <FiCalendar className="text-gray-500" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 bg-white shadow-xl rounded-md p-4 mt-2 w-full"
                    >
                        <DayPicker
                            mode="single"
                            selected={selected}
                            onSelect={(date) => {
                                if (date) {
                                    onDateChange(format(date, "yyyy-MM-dd"));
                                    setOpen(false);
                                }
                            }}
                            components={{
                                DayButton: (props) => {
                                    const date = props.day.date;
                                    const isValidDate =
                                        date instanceof Date &&
                                        !isNaN(date.getTime());
                                    const dateStr = isValidDate
                                        ? format(date, "yyyy-MM-dd")
                                        : "";
                                    const price = isValidDate
                                        ? fareMap[dateStr]
                                        : null;

                                    // Heatmap background (optional)
                                    let bgColor = "";
                                    if (
                                        price !== undefined &&
                                        minPrice !== null &&
                                        maxPrice !== null
                                    ) {
                                        const range = maxPrice - minPrice || 1;
                                        const percent =
                                            (price - minPrice) / range;
                                        if (percent < 0.33)
                                            bgColor = "bg-green-100";
                                        else if (percent < 0.66)
                                            bgColor = "bg-yellow-100";
                                        else bgColor = "bg-red-100";
                                    }

                                    return (
                                        <button
                                            className={`flex flex-col items-center justify-center rounded-full w-10 h-10 ${bgColor}`}
                                            onClick={() => {
                                                onDateChange(
                                                    format(date, "yyyy-MM-dd")
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            <span className="text-sm">
                                                {date.getDate()}
                                            </span>
                                            {price && (
                                                <span className="text-[10px] leading-none font-medium text-gray-700">
                                                    ₹{price}
                                                </span>
                                            )}
                                        </button>
                                    );
                                },
                            }}
                            hidden={{ before: hiddenFromDate || today }}
                            modifiersStyles={{
                                selected: {
                                    backgroundColor: "#0ea5e9",
                                    color: "white",
                                },
                                today: {
                                    border: "1px solid #0ea5e9",
                                },
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
