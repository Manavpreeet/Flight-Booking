"use client";

import { useMediaQuery } from "usehooks-ts";
import { FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import SortBar from "./SortBar";

type TopActionBarProps = {
    activeSort: string;
    onSortChange: (value: string) => void;
};

export default function TopActionBar({
    activeSort,
    onSortChange,
}: TopActionBarProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 py-3"
        >
            <SortBar activeSort={activeSort} onChange={onSortChange} />
        </motion.div>
    );
}
