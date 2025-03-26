// hooks/useFilterSortWorker.ts

import { useEffect, useRef, useState } from "react";
import type { Filters } from "@/workers/filterSort.worker";

export const useFilterSortWorker = (
    flights: any[],
    filters: Filters,
    activeSort: "cheapest" | "fastest"
) => {
    const workerRef = useRef<Worker | null>(null);
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        workerRef.current = new Worker(
            new URL("../workers/filterSort.worker.ts", import.meta.url),
            { type: "module" }
        );

        workerRef.current.onmessage = (e) => {
            setResult(e.data);
            setLoading(false);
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (!workerRef.current || !flights.length) return;

        setLoading(true);
        workerRef.current.postMessage({
            flights,
            filters,
            activeSort,
        });
    }, [flights, filters, activeSort]);

    return { result, loading };
};
