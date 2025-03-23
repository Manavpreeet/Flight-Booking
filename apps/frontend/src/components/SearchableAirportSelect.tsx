"use client";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

type Airport = {
    id: string;
    name: string;
    code: string;
    city: string;
    country: string;
};

type Props = {
    airports: Airport[];
    selected: Airport | null;
    onChange: (airport: Airport | null) => void;
    label: string;
    excludeCode?: string; // used to block selecting same code for origin/destination
};

export default function SearchableAirportSelect({
    airports,
    selected,
    onChange,
    label,
    excludeCode,
}: Props) {
    const [query, setQuery] = useState("");

    const filteredAirports = airports.filter(
        (airport) =>
            (!excludeCode || airport.code !== excludeCode) &&
            (airport.name.toLowerCase().includes(query.toLowerCase()) ||
                airport.city.toLowerCase().includes(query.toLowerCase()) ||
                airport.code.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="w-full">
            <Combobox value={selected} onChange={onChange}>
                <Combobox.Label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                </Combobox.Label>
                <div className="relative">
                    <Combobox.Input
                        className="w-full border border-gray-300 rounded-md p-3"
                        onChange={(e) => setQuery(e.target.value)}
                        displayValue={(airport: Airport) =>
                            airport
                                ? `${airport.code} - ${airport.name} (${airport.city}, ${airport.country})`
                                : ""
                        }
                        placeholder="Search airport..."
                    />
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                        {filteredAirports.length === 0 ? (
                            <div className="cursor-default select-none px-4 py-2 text-gray-500">
                                No results found.
                            </div>
                        ) : (
                            filteredAirports.map((airport) => (
                                <Combobox.Option
                                    key={airport.id}
                                    value={airport}
                                    className={({ active }) =>
                                        `cursor-pointer select-none px-4 py-2 ${
                                            active
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-900"
                                        }`
                                    }
                                >
                                    {airport.code} - {airport.name} (
                                    {airport.city}, {airport.country})
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
}
