"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { FiTag, FiClock, FiSend, FiArrowLeft } from "react-icons/fi";
import FlightCard from "@/components/FlightCard";
import FilterSidebar from "@/components/FilterSidebar";
import { motion } from "framer-motion";
import DirectFlightCard from "@/components/DirectFlightCard";
import ConnectingFlightCard from "@/components/ConnectingFlightCard";
import { useRouter } from "next/navigation";
import SortBar from "@/components/SortBar";
import TopActionBar from "@/components/TopActionBar";
import { useFlight } from "@/context/FlightContext";

export default function SearchResultsPage() {
    const { setSelectedFlight } = useFlight();

    const router = useRouter();
    const searchParams = useSearchParams();
    const tripType = searchParams.get("tripType");
    const routes = searchParams.get("routes");
    const classType = searchParams.get("classType");
    const numberOfAdults = searchParams.get("adults");
    const numberOfChildren = searchParams.get("children");
    const numberOfInfants = searchParams.get("infants");
    const [segments, setSegments] = useState<any[]>([]);
    const [selectedFlights, setSelectedFlights] = useState<{
        segment_1?: any;
        segment_2?: any;
    }>({});

    const allFlights = useMemo(
        () =>
            segments
                .flatMap((segment) => [
                    ...(segment.directFlights || []),
                    ...(segment.connectingFlights || []),
                ])
                .filter(Boolean), // Filter out undefined/null values
        [segments]
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSort, setActiveSort] = useState("cheapest");
    const [filters, setFilters] = useState<{
        airlines: string[];
        stops: string;
        priceRange: [number, number];
    }>({
        airlines: [],
        stops: "any",
        priceRange: [0, 10000],
    });

    useEffect(() => {
        if (!routes) return;

        const fetchResults = async () => {
            try {
                const res = await api.get(
                    `/flights?tripType=${tripType}&routes=${routes}&classType=${classType}`
                );

                const parsedSegments = Object.entries(res.data)
                    .filter(([key]) => key.startsWith("segment_"))
                    .map(([_, value]) => value);

                setSegments(parsedSegments);
            } catch (err) {
                toast.error("Failed to load search results");
                setError("Unable to fetch flight results.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [tripType, routes, classType]);

    if (loading)
        return (
            <div className="p-10 text-center text-lg">
                🔄 Searching flights...
            </div>
        );
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    const handleFlightSelect = (
        flight: any,
        isConnecting: boolean,
        segmentIndex: number
    ) => {
        const segmentKey = `segment_${segmentIndex + 1}`;
        setSelectedFlights((prev) => ({
            ...prev,
            [segmentKey]: {
                ...flight,
                isConnecting,
            },
        }));
    };

    const handleBookJourney = () => {
        if (!selectedFlights.segment_1 || !selectedFlights.segment_2) return;

        const hasConnecting =
            selectedFlights.segment_1?.isConnecting ||
            selectedFlights.segment_2?.isConnecting;

        setSelectedFlight({
            segments: [selectedFlights.segment_1, selectedFlights.segment_2],
            classType: classType,
            passengers: {
                adults: numberOfAdults,
                children: numberOfChildren,
                infants: numberOfInfants,
            },
            totalPassengers:
                parseInt(numberOfAdults || "0") +
                parseInt(numberOfChildren || "0") +
                parseInt(numberOfInfants || "0"),
        });

        router.push(
            `/booking?tripType=round-trip&isConnecting=${hasConnecting}`
        );
    };

    const handleOnBook = (flight: any, isConnecting: boolean) => {
        setSelectedFlight({
            segments: [flight],
            classType: classType,
            passengers: {
                adults: numberOfAdults,
                children: numberOfChildren,
                infants: numberOfInfants,
            },
            totalPassengers:
                parseInt(numberOfAdults || "0") +
                parseInt(numberOfChildren || "0") +
                parseInt(numberOfInfants || "0"),
        });
        router.push(`/booking?tripType=one-way&isConnecting=${isConnecting}`);
    };
    const applyFiltersAndSort = (flights: any[]) => {
        return flights
            .filter((flight) => {
                const isConnecting = Array.isArray(flight.legs);
                const legs = isConnecting ? flight.legs : [flight];

                const matchesAnyLeg = legs.some((leg) => {
                    const airline = leg.flights?.airlines?.name || "Unknown";
                    const price = parseInt(
                        leg.price || leg.flight_seats?.[0]?.price || "0"
                    );
                    const stops = legs.length - 1;

                    const matchesAirline =
                        filters.airlines.length === 0 ||
                        filters.airlines.includes(airline);
                    const matchesStops =
                        filters.stops === "any" ||
                        (filters.stops === "non-stop" && stops === 0) ||
                        (filters.stops === "1 stop" && stops === 1) ||
                        (filters.stops === "2+ stops" && stops >= 2);

                    const totalPrice = legs.reduce(
                        (sum, leg) =>
                            sum + parseInt(leg.flight_seats?.[0]?.price || "0"),
                        0
                    );
                    const matchesPrice =
                        totalPrice >= filters.priceRange[0] &&
                        totalPrice <= filters.priceRange[1];

                    const matches =
                        matchesAirline && matchesStops && matchesPrice;
                    return matches;
                });

                return matchesAnyLeg;
            })
            .sort((a, b) => {
                const getTotal =
                    (type: "price" | "duration") => (flight: any) => {
                        const legs = Array.isArray(flight.legs)
                            ? flight.legs
                            : [flight];
                        return legs.reduce((acc: number, leg: any) => {
                            if (type === "price")
                                return (
                                    acc +
                                    parseInt(
                                        leg.flight_seats?.[0]?.price || "0"
                                    )
                                );
                            if (type === "duration")
                                return acc + (leg.duration || 0);
                            return acc;
                        }, 0);
                    };

                const totalA = getTotal(
                    activeSort === "cheapest" ? "price" : "duration"
                )(a);
                const totalB = getTotal(
                    activeSort === "cheapest" ? "price" : "duration"
                )(b);
                if (activeSort === "cheapest") {
                    return totalA - totalB;
                }
                if (activeSort === "duration") {
                    return totalA - totalB;
                }
                return 0;
            });
    };

    // Use useMemo to prevent recalculating on every render

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <FilterSidebar
                allFlights={allFlights}
                onFilterChange={(updatedFilters) => {
                    // Prevent unnecessary state updates that might cause infinite loops
                    if (
                        JSON.stringify(filters) !==
                        JSON.stringify(updatedFilters)
                    ) {
                        setFilters(updatedFilters);
                    }
                }}
            />

            {/* Main Flight Results */}
            <main className="flex-1 p-6 space-y-10">
                {/* Sort Tabs */}
                <TopActionBar
                    activeSort={activeSort}
                    onSortChange={setActiveSort}
                />

                {/* Flight Segments */}
                {segments.map((segment, i) => (
                    <div key={i} className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Segment {i + 1} — Flights
                        </h2>

                        {/* Direct Flights */}
                        {segment.directFlights?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold mb-2">
                                    🛫 Direct Flights
                                </h3>
                                <div className="space-y-4">
                                    {applyFiltersAndSort(
                                        segment.directFlights
                                    ).map((flight: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-md shadow p-4"
                                        >
                                            <DirectFlightCard
                                                flight={
                                                    flight.flights || flight
                                                }
                                                seats={
                                                    flight.flight_seats || []
                                                }
                                                isSelected={
                                                    tripType === "round-trip" &&
                                                    selectedFlights[
                                                        `segment_${i + 1}`
                                                    ]?.id === flight.id
                                                }
                                                onBook={() => {
                                                    if (
                                                        tripType ===
                                                        "round-trip"
                                                    ) {
                                                        handleFlightSelect(
                                                            flight,
                                                            false,
                                                            i
                                                        );
                                                    } else {
                                                        handleOnBook(
                                                            flight,
                                                            false
                                                        );
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Connecting Flights */}
                        {segment.connectingFlights?.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold mb-2">
                                    🔁 Connecting Flights
                                </h3>
                                <div className="space-y-4">
                                    {applyFiltersAndSort(
                                        segment.connectingFlights
                                    ).map((conn: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-md shadow p-4"
                                        >
                                            <div className="space-y-2">
                                                <ConnectingFlightCard
                                                    connection={conn}
                                                    isSelected={
                                                        tripType ===
                                                            "round-trip" &&
                                                        selectedFlights[
                                                            `segment_${i + 1}`
                                                        ]?.id === conn.id
                                                    }
                                                    onBook={() => {
                                                        if (
                                                            tripType ===
                                                            "round-trip"
                                                        ) {
                                                            handleFlightSelect(
                                                                conn,
                                                                true,
                                                                i
                                                            );
                                                        } else {
                                                            handleOnBook(
                                                                conn,
                                                                true
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ))}
                {tripType === "round-trip" &&
                    selectedFlights.segment_1 &&
                    selectedFlights.segment_2 && (
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
                    )}
            </main>
        </div>
    );
}
