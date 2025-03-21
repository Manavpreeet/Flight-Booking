"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import FlightCard from "@/components/FlightCard";
import Loader from "@/components/Loader";
import { useFlight } from "@/context/FlightContext";
import { saveSearchResult } from "@/lib/indexedDB";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const tripType = searchParams.get("tripType");
    const routes = searchParams.get("routes");
    const classType = searchParams.get("classType");

    const [directFlights, setDirectFlights] = useState([]);
    const [connectingFlights, setConnectingFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("direct");

    const { setSelectedFlight } = useFlight();
    useEffect(() => {
        if (!routes) {
            setError("Invalid search parameters.");
            setLoading(false);
            return;
        }

        async function fetchFlights() {
            try {
                const response = await api.get(
                    `/flights?tripType=${tripType}&routes=${routes}&classType=${classType}`
                );
                const data = response.data.segment_1;
                const queryKey = JSON.stringify({
                    tripType,
                    routes,
                    classType,
                });

                await saveSearchResult(queryKey, data);

                setDirectFlights(data.directFlights);
                setConnectingFlights(data.connectingFlights);
            } catch (err) {
                setError("Failed to fetch flights. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchFlights();
    }, [tripType, routes, classType]);

    const handleBooking = (flightData: any, isConnectingFlight = false) => {
        setSelectedFlight(flightData); // ✅ Ensure flight is stored in context before navigating
        router.push(`/booking?isConnecting=${isConnectingFlight}`);
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
                ✈ Available Flights
            </h1>

            {/* Tabs for Direct & Connecting Flights */}
            <div className="flex justify-center mt-6 space-x-4">
                <button
                    onClick={() => setActiveTab("direct")}
                    className={`px-6 py-2 text-lg font-medium rounded-md transition ${activeTab === "direct" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                >
                    🛫 Direct Flights
                </button>
                <button
                    onClick={() => setActiveTab("connecting")}
                    className={`px-6 py-2 text-lg font-medium rounded-md transition ${activeTab === "connecting" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                >
                    🔁 Connecting Flights
                </button>
            </div>

            {/* Direct Flights Section */}
            {activeTab === "direct" && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700">
                        🛫 Direct Flights
                    </h2>
                    {directFlights.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No direct flights available.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {directFlights.map((flight, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-md rounded-lg p-6 border flex flex-col items-center"
                                >
                                    <FlightCard flight={flight} />
                                    <button
                                        onClick={() => handleBooking(flight.id)}
                                        className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold mt-4 hover:bg-green-600 transition"
                                    >
                                        ✅ Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Connecting Flights Section (Now in Horizontal Layout) */}
            {activeTab === "connecting" && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700">
                        🔁 Connecting Flights
                    </h2>
                    {connectingFlights.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No connecting flights available.
                        </p>
                    ) : (
                        <div className="space-y-6 mt-4">
                            {connectingFlights.map((connection, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-md rounded-lg p-6 border flex items-center justify-between space-x-4"
                                >
                                    {/* First Flight Leg */}
                                    <FlightCard
                                        flight={connection.firstLeg.flights}
                                        seats={connection.firstLeg.flight_seats}
                                    />

                                    {/* Layover Time */}
                                    <div className="text-center text-gray-500 flex flex-col items-center">
                                        <span className="text-lg">⏳</span>
                                        <span>
                                            {connection.secondLeg.layover_time}{" "}
                                            mins
                                        </span>
                                    </div>

                                    {/* Second Flight Leg */}
                                    <FlightCard
                                        flight={connection.secondLeg.flights}
                                        seats={
                                            connection.secondLeg.flight_seats
                                        }
                                    />

                                    {/* Single Book Button for the Entire Journey */}
                                    <button
                                        onClick={() =>
                                            handleBooking(connection, true)
                                        }
                                        className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
                                    >
                                        ✅ Book Full Journey
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
