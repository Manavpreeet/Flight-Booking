"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import DirectFlightCard from "@/components/DirectFlightCard";
import ConnectingFlightCard from "@/components/ConnectingFlightCard";
import FilterSidebar from "@/components/FilterSidebar";
import TopActionBar from "@/components/TopActionBar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFlight } from "@/context/FlightContext";
import { createFilterWorker } from "@/utils/createFilterWorker";
import type { Segment, FlightLeg, ConnectingFlight } from "@/types/flight";
import { getFlights } from "@/api/flights/handler";

export default function SearchResultsPage() {
    const { setSelectedFlight } = useFlight();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tripType = searchParams.get("trip_type");
    const routes = searchParams.get("routes");
    const cabinClass = searchParams.get("cabin_class");
    const numberOfAdults = searchParams.get("adults");
    const numberOfChildren = searchParams.get("children");
    const numberOfInfants = searchParams.get("infants");

    const [segments, setSegments] = useState<Segment[]>([]);
    const [selectedFlights, setSelectedFlights] = useState<Record<string, any>>(
        {}
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSort, setActiveSort] = useState("cheapest");
    const [filters, setFilters] = useState({
        airlines: [],
        stops: "any",
        priceRange: [0, 10000],
    });
    const workerRef = useRef<Worker | null>(null);
    const [filteredSortedCache, setFilteredSortedCache] = useState<
        Record<string, any[]>
    >({});

    const allFlights = useMemo(
        () =>
            segments
                .flatMap((segment) => [
                    ...(segment.direct_flights || []),
                    ...(segment.connecting_flights || []),
                ])
                .filter(Boolean),
        [segments]
    );

    useEffect(() => {
        workerRef.current = createFilterWorker();
        workerRef.current.onmessage = (e) => {
            const { segmentKey, result } = e.data;
            setFilteredSortedCache((prev) => ({
                ...prev,
                [segmentKey]: result,
            }));
        };
        return () => workerRef.current?.terminate();
    }, []);

    useEffect(() => {
        if (!routes) return;
        const fetchResults = async () => {
            try {
                const query = new URLSearchParams({
                    number_of_passengers: (
                        parseInt(numberOfAdults || "0") +
                        parseInt(numberOfChildren || "0") +
                        parseInt(numberOfInfants || "0")
                    ).toString(),
                    routes: routes,
                    cabin_class: cabinClass as string,
                }).toString();

                const res = await getFlights(query);
                if (res instanceof Error) throw res;
                setSegments(res.segments || []);
            } catch (err) {
                toast.error("Failed to load search results");
                setError("Unable to fetch flight results.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [tripType, routes, cabinClass]);

    useEffect(() => {
        segments.forEach((segment, i) => {
            const segmentKey = `segment_${i + 1}`;
            const flights = [
                ...(segment.direct_flights || []),
                ...(segment.connecting_flights || []),
            ];
            if (workerRef.current && flights.length > 0) {
                workerRef.current.postMessage({
                    segmentKey,
                    flights,
                    filters,
                    activeSort,
                });
            }
        });
    }, [segments, filters, activeSort]);

    const handleFlightSelect = (
        flight: any,
        isConnecting: boolean,
        segmentIndex: number
    ) => {
        const segmentKey = `segment_${segmentIndex + 1}`;
        setSelectedFlights((prev) => ({
            ...prev,
            [segmentKey]: { ...flight, isConnecting },
        }));
    };

    const handleBookJourney = () => {
        const segmentKeys = Object.keys(selectedFlights).filter((k) =>
            k.startsWith("segment_")
        );
        const allFlights = segmentKeys.map((k) => selectedFlights[k]);
        const segments = allFlights.map((f) => ({
            isConnecting: f.isConnecting,
            legs: f.isConnecting ? f.legs : [f],
        }));

        const allSelected = Array.from(
            { length: segmentKeys.length },
            (_, i) => `segment_${i + 1}`
        ).every((k) => selectedFlights[k]);
        if (!allSelected) return;

        const hasConnecting = Object.values(selectedFlights).some(
            (f: any) => f?.isConnecting
        );

        const totalAmount = allFlights.reduce((sum, flight) => {
            if (flight.isConnecting) {
                return (
                    sum +
                    flight.legs.reduce((legSum: number, leg: any) => {
                        const cheapestSeats = leg.seats
                            .filter((s: any) => s.is_available)
                            .sort((a: any, b: any) => a.price - b.price)
                            .slice(
                                0,
                                parseInt(numberOfAdults || "0") +
                                    parseInt(numberOfChildren || "0") +
                                    parseInt(numberOfInfants || "0")
                            );
                        return (
                            legSum +
                            cheapestSeats.reduce(
                                (s: number, seat: any) => s + seat.price,
                                0
                            )
                        );
                    }, 0)
                );
            } else {
                const cheapestSeats = flight.seats
                    .filter((s: any) => s.is_available)
                    .sort((a: any, b: any) => a.price - b.price)
                    .slice(
                        0,
                        parseInt(numberOfAdults || "0") +
                            parseInt(numberOfChildren || "0") +
                            parseInt(numberOfInfants || "0")
                    );
                return (
                    sum +
                    cheapestSeats.reduce(
                        (s: number, seat: any) => s + seat.price,
                        0
                    )
                );
            }
        }, 0);

        setSelectedFlight({
            segments,
            classType: cabinClass,
            passengers: {
                adults: numberOfAdults,
                children: numberOfChildren,
                infants: numberOfInfants,
            },
            totalPassengers:
                parseInt(numberOfAdults || "0") +
                parseInt(numberOfChildren || "0") +
                parseInt(numberOfInfants || "0"),
            totalAmount,
        });
        router.push(
            `/booking?trip_type=${tripType}&isConnecting=${hasConnecting}`
        );
    };

    if (loading)
        return (
            <div className="p-10 text-center text-lg">
                🔄 Searching flights...
            </div>
        );
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    const hasMissingSegments =
        (tripType === "round-trip" || tripType === "multi-city") &&
        segments.some(
            (segment) =>
                !segment.direct_flights?.length &&
                !segment.connecting_flights?.length
        );

    if (hasMissingSegments) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white text-gray-600 text-lg">
                <div className="block text-center">
                    ⚠️ Sorry, one or more segments have no available flights.
                    <div
                        className="text-sky-500 cursor-pointer"
                        onClick={() => router.replace("/")}
                    >
                        <FiArrowLeft className="inline-block" />
                        <span className="ml-2">Go back and try again.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <FilterSidebar
                allFlights={allFlights}
                onFilterChange={(updatedFilters) => {
                    if (
                        JSON.stringify(filters) !==
                        JSON.stringify(updatedFilters)
                    ) {
                        setFilters(updatedFilters);
                    }
                }}
            />
            <main className="flex-1 p-6 space-y-10">
                <TopActionBar
                    activeSort={activeSort}
                    onSortChange={setActiveSort}
                />
                {segments.map((segment, i) => {
                    const segmentKey = `segment_${i + 1}`;
                    const filtered = filteredSortedCache[segmentKey] || [];
                    const direct = filtered.filter(
                        (f) => !Array.isArray(f.legs)
                    );
                    const connecting = filtered.filter((f) =>
                        Array.isArray(f.legs)
                    );
                    const recommendation = segment.recommendation;

                    return (
                        <div key={i} className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                Segment {i + 1} — Flights
                            </h2>

                            {(recommendation?.direct ||
                                recommendation?.connecting) && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-2 text-yellow-600">
                                        🌟 Recommended Flights
                                    </h3>
                                    <div className="space-y-4">
                                        {recommendation.direct && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow"
                                            >
                                                <DirectFlightCard
                                                    flight={
                                                        recommendation.direct
                                                    }
                                                    seats={
                                                        recommendation.direct
                                                            .seats
                                                    }
                                                    isSelected={
                                                        selectedFlights[
                                                            segmentKey
                                                        ]?.id ===
                                                        recommendation.direct.id
                                                    }
                                                    onBook={() =>
                                                        handleFlightSelect(
                                                            recommendation.direct,
                                                            false,
                                                            i
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        )}
                                        {recommendation.connecting && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow"
                                            >
                                                <ConnectingFlightCard
                                                    connection={
                                                        recommendation.connecting
                                                    }
                                                    isSelected={
                                                        selectedFlights[
                                                            segmentKey
                                                        ]?.id ===
                                                        recommendation
                                                            .connecting.id
                                                    }
                                                    onBook={() =>
                                                        handleFlightSelect(
                                                            recommendation.connecting,
                                                            true,
                                                            i
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {direct.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">
                                        🛫 Direct Flights
                                    </h3>
                                    <div className="space-y-4">
                                        {direct.map((flight, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: idx * 0.05,
                                                }}
                                                className="bg-white rounded-md shadow p-4"
                                            >
                                                <DirectFlightCard
                                                    flight={flight}
                                                    seats={flight.seats || []}
                                                    isSelected={
                                                        selectedFlights[
                                                            segmentKey
                                                        ]?.id === flight.id
                                                    }
                                                    onBook={() =>
                                                        handleFlightSelect(
                                                            flight,
                                                            false,
                                                            i
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {connecting.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">
                                        🔁 Connecting Flights
                                    </h3>
                                    <div className="space-y-4">
                                        {connecting.map((conn, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: idx * 0.05,
                                                }}
                                                className="bg-white rounded-md shadow p-4"
                                            >
                                                <ConnectingFlightCard
                                                    connection={conn}
                                                    isSelected={
                                                        selectedFlights[
                                                            segmentKey
                                                        ]?.id === conn.id
                                                    }
                                                    onBook={() =>
                                                        handleFlightSelect(
                                                            conn,
                                                            true,
                                                            i
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    );
                })}
                {(() => {
                    const segmentKeys = Object.keys(selectedFlights).filter(
                        (k) => k.startsWith("segment_")
                    );
                    const totalSegments = segments.length;
                    const allSelected = Array.from(
                        { length: totalSegments },
                        (_, i) => `segment_${i + 1}`
                    ).every((k) => selectedFlights[k]);
                    return (
                        totalSegments > 0 &&
                        allSelected && (
                            <div className="fixed bottom-4 right-4 z-50">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold text-lg"
                                    onClick={handleBookJourney}
                                >
                                    Book Journey
                                </motion.button>
                            </div>
                        )
                    );
                })()}
            </main>
        </div>
    );
}
