"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import FareCalendar from "@/components/FareCalendar";

export default function FlightSearch() {
    const [tripType, setTripType] = useState("one-way");
    const [flights, setFlights] = useState([
        { origin: "", destination: "", date: "" },
    ]);
    const [roundTripDates, setRoundTripDates] = useState({
        startDate: "",
        endDate: "",
    });
    const [classType, setClassType] = useState("Economy");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [alternativeFlights, setAlternativeFlights] = useState<any[]>([]);
    const router = useRouter();

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setAlternativeFlights([]);

        // 🔹 Ensure selectedDate is set in flights[0].date before sending request
        setFlights((prevFlights) => [
            { ...prevFlights[0], date: selectedDate || prevFlights[0].date },
        ]);

        let searchRoutes = flights;
        if (tripType === "round-trip") {
            searchRoutes = [
                {
                    origin: flights[0].origin,
                    destination: flights[0].destination,
                    date: roundTripDates.startDate,
                },
                {
                    origin: flights[0].destination,
                    destination: flights[0].origin,
                    date: roundTripDates.endDate,
                },
            ];
        }

        const queryParams = new URLSearchParams({
            tripType,
            routes: JSON.stringify(searchRoutes),
            classType,
        });

        try {
            // 🔹 Fetch Regular Flights First
            const response = await api.get(
                `/flights?${queryParams.toString()}`
            );
            console.log(
                "Flights found:",
                response.data.segment_1.directFlights
            );
            let directFlights = response.data.segment_1.directFlights;
            let connectingFlights = response.data.segment_1.connectingFlights;

            if (directFlights?.length > 0 || connectingFlights?.length > 0) {
                router.push(`/search-results?${queryParams.toString()}`);
                return;
            }

            // 🔹 If No Direct Flights, Fetch Alternative Flights
            console.log("No direct flights found, fetching alternatives...");
            const altQueryParams = new URLSearchParams({
                origin: flights[0].origin,
                destination: flights[0].destination,
                travelDate: flights[0].date || selectedDate || "",
                maxPrice: "5000",
            });

            const altResponse = await api.get(
                `/flights/alternate?${altQueryParams.toString()}`
            );
            console.log("Alternative Flights:", altResponse.data);

            if (altResponse?.data?.alternatives?.length > 0) {
                setAlternativeFlights(altResponse.data.alternatives);
            } else {
                console.log("Setting no flights found error");
                setError("No flights found, including alternatives.");
            }
        } catch (err) {
            console.log(err);
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-lg p-8 space-y-6 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700">
                🔍 Search Flights
            </h2>

            {/* Tabs for Trip Type Selection */}
            <div className="flex space-x-4">
                {["one-way", "round-trip", "multi-city"].map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setTripType(type);
                            if (type === "one-way")
                                setFlights([
                                    { origin: "", destination: "", date: "" },
                                ]);
                            else if (type === "round-trip")
                                setFlights([{ origin: "", destination: "" }]);
                            else
                                setFlights([
                                    { origin: "", destination: "", date: "" },
                                ]);
                        }}
                        className={`px-4 py-2 rounded-md font-medium ${
                            tripType === type
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        } transition`}
                    >
                        {type === "one-way"
                            ? "One Way"
                            : type === "round-trip"
                              ? "Round Trip"
                              : "Multi-City"}
                    </button>
                ))}
            </div>

            {/* Flight Inputs */}
            {tripType === "one-way" && (
                <div className="grid grid-cols-2 gap-4 text-gray-800">
                    <input
                        type="text"
                        placeholder="Origin (e.g., IXC)"
                        className="border p-3 rounded-md w-full"
                        value={flights[0].origin}
                        onChange={(e) =>
                            setFlights([
                                { ...flights[0], origin: e.target.value },
                            ])
                        }
                    />
                    <input
                        type="text"
                        placeholder="Destination (e.g., BLR)"
                        className="border p-3 rounded-md w-full"
                        value={flights[0].destination}
                        onChange={(e) =>
                            setFlights([
                                { ...flights[0], destination: e.target.value },
                            ])
                        }
                    />
                </div>
            )}

            {/* Fare Calendar for One-Way Flights */}
            {flights[0].origin &&
                flights[0].destination &&
                tripType === "one-way" && (
                    <FareCalendar
                        origin={flights[0].origin}
                        destination={flights[0].destination}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setFlights((prevFlights) => [
                                { ...prevFlights[0], date },
                            ]); // 🔹 Ensure state is updated
                        }}
                    />
                )}

            {/* Date Picker for One-Way & Multi-City */}
            {tripType !== "round-trip" && (
                <input
                    type="date"
                    className="border p-3 rounded-md w-full mt-4"
                    value={flights[0].date || selectedDate || ""}
                    onChange={(e) => {
                        const dateValue = e.target.value;
                        setSelectedDate(dateValue);
                        setFlights([{ ...flights[0], date: dateValue }]);
                    }}
                />
            )}

            {/* Search Button */}
            <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full text-lg font-semibold shadow-md hover:bg-blue-600 transition"
            >
                {loading ? "Searching..." : "🚀 Search Flights"}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* 🔹 Show Alternative Flights if Available */}
            {alternativeFlights.length > 0 && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">
                        🔄 Alternative Flights Available
                    </h3>
                    {alternativeFlights.map((flight, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white shadow-sm rounded-lg my-2"
                        >
                            <div>
                                <p className="text-md font-semibold">
                                    ✈ {flight.flights.flight_number} -{" "}
                                    {flight.flights.airline_id}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {
                                        flight
                                            .airports_flight_legs_origin_airport_idToairports
                                            .name
                                    }{" "}
                                    →{" "}
                                    {
                                        flight
                                            .airports_flight_legs_dest_airport_idToairports
                                            .name
                                    }
                                </p>
                                <p className="text-sm text-gray-500">
                                    🕒{" "}
                                    {new Date(
                                        flight.departure_time
                                    ).toLocaleTimeString()}{" "}
                                    -{" "}
                                    {new Date(
                                        flight.arrival_time
                                    ).toLocaleTimeString()}{" "}
                                    | ⏳ {flight.duration} mins
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                    ₹{flight.flight_seats[0]?.price || "N/A"}
                                </p>
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/booking?flightId=${flight.id}`
                                        )
                                    }
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
                                >
                                    ✈ Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
