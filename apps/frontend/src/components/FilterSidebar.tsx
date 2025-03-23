"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiFilter, FiRotateCcw } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";

type FilterSidebarProps = {
    allFlights: any[];
    onFilterChange: (filters: {
        airlines: string[];
        stops: string;
        priceRange: [number, number];
    }) => void;
};

export default function FilterSidebar({
    allFlights,
    onFilterChange,
}: FilterSidebarProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    const [airlines, setAirlines] = useState<string[]>([]);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [stops, setStops] = useState<string>("any");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    const prices = allFlights.map((f) =>
        Array.isArray(f.legs)
            ? f.legs.reduce(
                  (sum: number, leg: any) =>
                      sum + parseInt(leg.flight_seats?.[0]?.price || "0"),
                  0
              )
            : parseInt(f.flight_seats?.[0]?.price || "0")
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    useEffect(() => {
        const uniqueAirlines = Array.from(
            new Set(
                allFlights.map(
                    (f) =>
                        f.flights?.airlines?.name ||
                        f.airlines?.name ||
                        "Unknown Airline"
                )
            )
        );
        setAirlines(uniqueAirlines);
        setPriceRange([minPrice, maxPrice]);
    }, [allFlights]);

    useEffect(() => {
        onFilterChange({ airlines: selectedAirlines, stops, priceRange });
    }, [selectedAirlines, stops, priceRange]);

    const toggleAirline = (airline: string) => {
        setSelectedAirlines((prev) =>
            prev.includes(airline)
                ? prev.filter((a) => a !== airline)
                : [...prev, airline]
        );
    };

    const resetFilters = () => {
        setSelectedAirlines([]);
        setStops("any");
        setPriceRange([minPrice, maxPrice]);
    };

    const filterSectionVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
        }),
    };

    const FilterContent = () => (
        <div className="w-full bg-white p-4 rounded-lg  text-gray-800 space-y-6">
            {[...["Airlines", "Stops", "Price Range"]].map((section, i) => (
                <motion.div
                    key={section}
                    custom={i}
                    variants={filterSectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {section === "Airlines" && (
                        <div>
                            <p className="text-sm font-semibold mb-2">
                                Airlines
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {airlines.map((airline) => (
                                    <label
                                        key={airline}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedAirlines.includes(
                                                airline
                                            )}
                                            onChange={() =>
                                                toggleAirline(airline)
                                            }
                                            className="accent-sky-600"
                                        />
                                        {airline}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {section === "Stops" && (
                        <div>
                            <p className="text-sm font-semibold mb-2">Stops</p>
                            <div className="space-y-1">
                                {["any", "non-stop", "1 stop", "2+ stops"].map(
                                    (label) => (
                                        <label
                                            key={label}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                value={label}
                                                checked={stops === label}
                                                onChange={(e) =>
                                                    setStops(e.target.value)
                                                }
                                                className="accent-sky-600"
                                            />
                                            {label}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {section === "Price Range" && (
                        <div>
                            <p className="text-sm font-semibold mb-2 flex items-center gap-1">
                                <LiaRupeeSignSolid /> Price Range
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    min={minPrice}
                                    max={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            Number(e.target.value),
                                            priceRange[1],
                                        ])
                                    }
                                    className="w-full border rounded-md p-1"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    min={priceRange[0]}
                                    max={maxPrice}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Number(e.target.value),
                                        ])
                                    }
                                    className="w-full border rounded-md p-1"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <aside className="w-full md:max-w-xs md:min-w-[300px] bg-white p-6 h-screen sticky top-0 border-r flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
                            className="text-sm flex items-center gap-1 text-sky-600 hover:underline"
                        >
                            <FiArrowLeft />
                            Back
                        </button>
                        <button
                            onClick={resetFilters}
                            className="text-sm flex items-center gap-1 text-rose-600 hover:underline"
                        >
                            <FiRotateCcw />
                            Reset
                        </button>
                    </div>

                    <h2 className="text-lg font-semibold text-sky-700 flex items-center gap-2 mb-4">
                        <FiFilter />
                        Filters
                    </h2>

                    <div className="overflow-y-auto flex-grow">
                        <FilterContent />
                    </div>
                </aside>
            )}

            {/* MOBILE DRAWER */}
            {isMobile && (
                <>
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="fixed bottom-4 right-4 z-50 bg-sky-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                        <FiFilter />
                        Filters
                    </button>

                    <AnimatePresence>
                        {drawerOpen && (
                            <>
                                <motion.div
                                    className="fixed inset-0 bg-gray-50/60  z-40"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    onClick={() => setDrawerOpen(false)}
                                />

                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeInOut",
                                    }}
                                    className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-sky-700 flex items-center gap-2">
                                            <FiFilter />
                                            Filters
                                        </h3>
                                        <button
                                            onClick={() => setDrawerOpen(false)}
                                            className="text-sm text-sky-600 font-medium"
                                        >
                                            Done
                                        </button>
                                    </div>
                                    <FilterContent />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}
        </>
    );
}
