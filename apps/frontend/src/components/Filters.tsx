import { useState } from "react";

interface FiltersProps {
    onFilterChange: (filters: { airline: string; maxPrice: number }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
    const [airline, setAirline] = useState("");
    const [maxPrice, setMaxPrice] = useState(500);

    return (
        <div className="bg-white shadow-md p-6 rounded-lg border">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="mt-4">
                <label className="block text-gray-700 font-medium">
                    Airline
                </label>
                <input
                    type="text"
                    placeholder="Airline name"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="mt-4">
                <label className="block text-gray-700 font-medium">
                    Max Price: ${maxPrice}
                </label>
                <input
                    type="range"
                    min="100"
                    max="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                />
            </div>
            <button
                onClick={() => onFilterChange({ airline, maxPrice })}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
            >
                Apply Filters
            </button>
        </div>
    );
}
