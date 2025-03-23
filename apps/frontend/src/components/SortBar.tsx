"use client";

import { motion } from "framer-motion";
import { FiTag, FiSend, FiClock } from "react-icons/fi";

type SortOption = {
    label: string;
    icon: React.ReactNode;
    value: string;
};

type SortBarProps = {
    activeSort: string;
    onChange: (value: string) => void;
};

const sortOptions: SortOption[] = [
    {
        label: "Cheapest",
        icon: <FiTag />,
        value: "cheapest",
    },
    {
        label: "Non-Stop First",
        icon: <FiSend />,
        value: "non-stop",
    },
    {
        label: "Shortest Duration",
        icon: <FiClock />,
        value: "duration",
    },
];

const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
    }),
};

export default function SortBar({ activeSort, onChange }: SortBarProps) {
    return (
        <motion.div
            className="w-full overflow-x-auto pb-2"
            initial="hidden"
            animate="visible"
        >
            <div className="flex gap-3 min-w-max">
                {sortOptions.map(({ label, icon, value }, i) => (
                    <motion.button
                        key={label}
                        custom={i}
                        variants={buttonVariants}
                        onClick={() => onChange(value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm ${
                            activeSort === value
                                ? "bg-sky-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {icon} {label}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
