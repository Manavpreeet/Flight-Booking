// hooks/useFareCalendar.ts
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type FareMap = Record<string, number>;

export function useFareCalendar(origin: string, destination: string) {
    const [fareMap, setFareMap] = useState<FareMap>({});
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!origin || !destination) return;

        const today = new Date();
        const startDate = today.toISOString().split("T")[0];
        const endDate = new Date(today.setDate(today.getDate() + 30))
            .toISOString()
            .split("T")[0];

        const fetchFareData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    origin,
                    destination,
                    startDate,
                    endDate,
                });
                const res = await api.get(`/flights/fare-calendar?${params}`);
                const data = await res.data;

                const map: FareMap = {};
                let min = Infinity;
                let max = -Infinity;

                for (const fare of data.fares) {
                    const date = fare.travel_date.split("T")[0]; // yyyy-mm-dd
                    map[date] = fare.price;
                    min = Math.min(min, fare.price);
                    max = Math.max(max, fare.price);
                }

                setFareMap(map);
                setMinPrice(min === Infinity ? null : min);
                setMaxPrice(max === -Infinity ? null : max);
            } catch (err) {
                console.error("Failed to load fare calendar", err);
                setFareMap({});
                setMinPrice(null);
                setMaxPrice(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFareData();
    }, [origin, destination]);

    return { fareMap, minPrice, maxPrice, loading };
}
