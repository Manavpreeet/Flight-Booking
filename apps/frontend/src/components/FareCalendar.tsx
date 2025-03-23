"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import { api } from "@/lib/api";
import { format, parseISO } from "date-fns";

type FareData = {
    travel_date: string;
    price: number;
    airline: string;
};

export default function FareCalendar({
    title,
    origin,
    destination,
    onSelectDate,
}: {
    title: string;
    origin: string;
    destination: string;
    onSelectDate: (date: string) => void;
}) {
    const [fares, setFares] = useState<FareData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (origin && destination) {
            fetchFareData();
        }
    }, [origin, destination]);

    const fetchFareData = async () => {
        setLoading(true);
        setError(null);

        try {
            const startDate = format(new Date(), "yyyy-MM-dd");
            const endDate = format(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                "yyyy-MM-dd"
            ); // 30 Days Ahead
            const queryParams = new URLSearchParams({
                origin,
                destination,
                startDate,
                endDate,
            });

            const response = await api.get(
                `/flights/fare-calendar?${queryParams.toString()}`
            );
            setFares(response.data.fares);
        } catch (err) {
            setError("Failed to fetch fare calendar.");
        } finally {
            setLoading(false);
        }
    };

    // Map dates to lowest prices
    const fareMap: Record<string, FareData> = {};
    fares.forEach((fare) => {
        fareMap[format(parseISO(fare.travel_date), "yyyy-MM-dd")] = fare;
    });

    // Color-coded pricing logic
    const getTileClass = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const fare = fareMap[dateStr];

        if (!fare) return "bg-gray-200 text-gray-500"; // No flight

        if (fare.price < 4500) return "bg-green-500 text-white"; // Cheap
        if (fare.price < 6000) return "bg-yellow-500 text-black"; // Mid-range
        return "bg-red-500 text-white"; // Expensive
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto text-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                {title}
            </h3>

            {loading && <p className="text-gray-500 mt-2">Fetching fares...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4">
                <Calendar
                    onClickDay={(date) =>
                        onSelectDate(format(date, "yyyy-MM-dd"))
                    }
                    tileContent={({ date }) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const fare = fareMap[dateStr];

                        return fare ? (
                            <div
                                className={`p-1 text-xs font-semibold rounded ${getTileClass(date)} text-center`}
                            >
                                ₹{fare.price}
                            </div>
                        ) : null;
                    }}
                    tileClassName={({ date }) => getTileClass(date)}
                    className="shadow-md rounded-lg border border-gray-300 w-full"
                />
            </div>
        </div>
    );
}
