"use client";
import { useState, useEffect } from "react";
import OneWaySearch from "./OneWaySearch";
import toast from "react-hot-toast";
import TravellerClassSelector from "./TravelClassSelector";
import TripTypeTabs from "./TripTypeTabs";
import { api } from "@/lib/api";
import RoundTripSearch from "./RoundTripSearch";
import { AnimatePresence, motion } from "framer-motion";
import MultiCitySearch from "./MultiCityTrip";
import { useRouter } from "next/navigation";
import { fetchWithCache } from "@/lib/cache";

export default function FlightSearch() {
    const router = useRouter();

    const [tripType, setTripType] = useState<
        "one-way" | "round-trip" | "multi-city"
    >("one-way");

    const [airports, setAirports] = useState<any[]>([]);

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [travellers, setTravellers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [cabinClass, setCabinClass] = useState<
        "Economy" | "Premium Economy" | "Business" | "First"
    >("Economy");

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const res = await api.get("/airports");
                setAirports(res.data);
            } catch (err) {
                console.error("Failed to load airports", err);
            }
        };

        fetchAirports();
    }, []);

    const handleSearch = async (query: string) => {
        const cacheKey = `flights_${query}`;

        try {
            const response = await fetchWithCache(cacheKey, async () => {
                const res = await api.get(`/flights?${query}`);
                return res.data;
            });
            query += `&adults=${travellers.adults}&children=${travellers.children}&infants=${travellers.infants}`;
            if (Object.keys(response).length > 0) {
                router.push(`/search-results?${query}`);
            } else {
                toast.error("No flights found.");
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch flights. Please try again.");
        }
    };
    const handleRoundTripSearch = async (data: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate: string;
    }) => {
        const { origin, destination, departureDate, returnDate } = data;

        const routeQuery = [
            {
                origin,
                destination,
                date: departureDate,
            },
            {
                origin: destination,
                destination: origin,
                date: returnDate,
            },
        ];

        const query = new URLSearchParams({
            tripType: "round-trip",
            routes: JSON.stringify(routeQuery),
            classType: cabinClass,
        }).toString();

        await handleSearch(query);
    };

    const handleOneWaySearch = async (data: {
        origin: string;
        destination: string;
        departureDate: string;
    }) => {
        let routeQuery = [
            {
                origin: data.origin,
                destination: data.destination,
                date: data.departureDate,
            },
        ];

        let tripTypeQuery = tripType;
        let tripClassQuery = cabinClass;

        let query = new URLSearchParams({
            tripType: tripTypeQuery,
            routes: JSON.stringify(routeQuery),
            classType: tripClassQuery,
        }).toString();
        handleSearch(query);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-[#ffffff82] rounded-xl shadow-lg p-6 md:p-10 space-y-6"
        >
            {/* Trip Type Tabs */}
            <TripTypeTabs
                selectedType={tripType}
                onChange={(type) => {
                    if (
                        type === "one-way" ||
                        type === "round-trip" ||
                        type === "multi-city"
                    ) {
                        setTripType(
                            type as "one-way" | "round-trip" | "multi-city"
                        );
                    }
                }}
            />
            <TravellerClassSelector
                travellers={travellers}
                setTravellers={setTravellers}
                cabinClass={cabinClass}
                setCabinClass={setCabinClass}
            />

            <AnimatePresence mode="wait">
                {tripType === "one-way" && (
                    <motion.div
                        key="oneway"
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <OneWaySearch
                            airports={airports}
                            onSearch={handleOneWaySearch}
                            isVisible={true}
                        />
                    </motion.div>
                )}

                {tripType === "round-trip" && (
                    <motion.div
                        key="roundtrip"
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RoundTripSearch
                            airports={airports}
                            onSearch={handleRoundTripSearch}
                            isVisible={true}
                        />
                    </motion.div>
                )}

                {tripType === "multi-city" && (
                    <motion.div
                        key="multi-city"
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MultiCitySearch
                            airports={airports}
                            onSearch={handleRoundTripSearch}
                            isVisible={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Round-trip & Multi-city placeholders for now */}
            {!["one-way", "round-trip"].includes(tripType) && (
                <div className="p-6 bg-blue-50 text-blue-700 rounded-lg text-center">
                    🚧{" "}
                    <strong>{tripType.replace("-", " ").toUpperCase()}</strong>{" "}
                    coming next...
                </div>
            )}
        </motion.div>
    );
}

// "use client";
// import { useState, useEffect } from "react";
// import { api } from "@/lib/api";
// import { useRouter } from "next/navigation";
// import FareCalendar from "@/components/FareCalendar";
// import SearchableAirportSelect from "./SearchableAirportSelect";
// import TripTypeTabs from "./TripTypeTabs";

// export default function FlightSearch() {
//     const [tripType, setTripType] = useState("one-way");
//     const [flights, setFlights] = useState([
//         { origin: "", destination: "", date: "" },
//     ]);
//     const [roundTripDates, setRoundTripDates] = useState({
//         startDate: "",
//         endDate: "",
//     });
//     const [classType, setClassType] = useState("Economy");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedDate, setSelectedDate] = useState<string | null>(null);
//     const [alternativeFlights, setAlternativeFlights] = useState<any[]>([]);
//     const router = useRouter();

//     const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);
//     const [selectedDestination, setSelectedDestination] = useState<any | null>(
//         null
//     );

//     const [airports, setAirports] = useState<any[]>([]);

//     useEffect(() => {
//         const fetchAirports = async () => {
//             try {
//                 const res = await api.get("/airports");
//                 setAirports(res.data);
//             } catch (err) {
//                 console.error("Failed to load airports", err);
//             }
//         };

//         fetchAirports();
//     }, []);

//     console.log();

//     const handleSearch = async () => {
//         setLoading(true);
//         setError(null);
//         setAlternativeFlights([]);

//         let searchRoutes = flights;

//         if (tripType === "one-way") {
//             searchRoutes = [
//                 {
//                     origin: flights[0].origin,
//                     destination: flights[0].destination,
//                     date: selectedDate || flights[0].date,
//                 },
//             ];
//         }

//         if (tripType === "round-trip") {
//             searchRoutes = [
//                 {
//                     origin: flights[0].origin,
//                     destination: flights[0].destination,
//                     date: roundTripDates.startDate,
//                 },
//                 {
//                     origin: flights[0].destination,
//                     destination: flights[0].origin,
//                     date: roundTripDates.endDate,
//                 },
//             ];
//         }

//         const queryParams = new URLSearchParams({
//             tripType,
//             routes: JSON.stringify(searchRoutes),
//             classType,
//         });

//         try {
//             const response = await api.get(
//                 `/flights?${queryParams.toString()}`
//             );
//             const directFlights = response.data.segment_1.directFlights;
//             const connectingFlights = response.data.segment_1.connectingFlights;

//             if (directFlights?.length > 0 || connectingFlights?.length > 0) {
//                 router.push(`/search-results?${queryParams.toString()}`);
//                 return;
//             }

//             const altQueryParams = new URLSearchParams({
//                 origin: flights[0].origin,
//                 destination: flights[0].destination,
//                 travelDate: flights[0].date || selectedDate || "",
//                 maxPrice: "5000",
//             });

//             const altResponse = await api.get(
//                 `/flights/alternate?${altQueryParams.toString()}`
//             );
//             if (altResponse?.data?.alternatives?.length > 0) {
//                 setAlternativeFlights(altResponse.data.alternatives);
//             } else {
//                 setError("No flights found, including alternatives.");
//             }
//         } catch (err) {
//             console.log(err);
//             setError("Failed to fetch flights. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="bg-white shadow-xl rounded-lg p-8 space-y-6 w-full max-w-4xl mx-auto">
//             <h2 className="text-2xl font-semibold text-gray-700">
//                 🔍 Search Flights
//             </h2>

//             <TripTypeTabs selectedType={tripType} onChange={setTripType} />

//             {/* Class Type */}
//             <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Cabin Class
//                 </label>
//                 <select
//                     value={classType}
//                     onChange={(e) => setClassType(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md p-3 text-gray-800"
//                 >
//                     <option value="Economy">Economy</option>
//                     <option value="Premium Economy">Premium Economy</option>
//                     <option value="Business">Business</option>
//                     <option value="First Class">First Class</option>
//                 </select>
//             </div>

//             {/* One-Way / Round-Trip UI */}
//             {(tripType === "one-way" || tripType === "round-trip") && (
//                 <div className="grid grid-cols-2 gap-4 text-gray-800">
//                     <SearchableAirportSelect
//                         airports={airports}
//                         selected={selectedOrigin}
//                         onChange={(airport) => {
//                             setSelectedOrigin(airport);
//                             const code = airport?.code || "";
//                             if (tripType === "one-way") {
//                                 setFlights([{ ...flights[0], origin: code }]);
//                             }
//                             if (tripType === "round-trip") {
//                                 setFlights([
//                                     { ...flights[0], origin: code },
//                                     { ...flights[1], destination: code },
//                                 ]);
//                             }
//                         }}
//                         label="Origin"
//                         excludeCode={selectedDestination?.code}
//                     />
//                     <SearchableAirportSelect
//                         airports={airports}
//                         selected={selectedDestination}
//                         onChange={(airport) => {
//                             setSelectedDestination(airport);
//                             const code = airport?.code || "";
//                             if (tripType === "one-way") {
//                                 setFlights([
//                                     { ...flights[0], destination: code },
//                                 ]);
//                             }
//                             if (tripType === "round-trip") {
//                                 setFlights([
//                                     { ...flights[0], destination: code },
//                                     { ...flights[1], origin: code },
//                                 ]);
//                             }
//                         }}
//                         label="Destination"
//                         excludeCode={selectedOrigin?.code}
//                     />
//                 </div>
//             )}

//             {/* Multi-City UI */}
//             {tripType === "multi-city" && (
//                 <div className="space-y-6">
//                     {flights.map((flight, index) => (
//                         <div
//                             key={index}
//                             className="border p-4 rounded-md bg-gray-50 space-y-4"
//                         >
//                             <div className="flex justify-between items-center">
//                                 <h4 className="font-semibold text-gray-700">
//                                     Segment {index + 1}
//                                 </h4>
//                                 {flights.length > 1 && (
//                                     <button
//                                         onClick={() => {
//                                             setFlights((prev) =>
//                                                 prev.filter(
//                                                     (_, i) => i !== index
//                                                 )
//                                             );
//                                         }}
//                                         className="text-red-500 text-sm hover:underline"
//                                     >
//                                         ❌ Remove
//                                     </button>
//                                 )}
//                             </div>
//                             <div className="grid grid-cols-2 gap-4 text-gray-800">
//                                 <SearchableAirportSelect
//                                     airports={airports}
//                                     selected={airports.find(
//                                         (a) => a.code === flight.origin
//                                     )}
//                                     onChange={(airport) => {
//                                         const updated = [...flights];
//                                         updated[index].origin =
//                                             airport?.code || "";
//                                         setFlights(updated);
//                                     }}
//                                     label="Origin"
//                                     excludeCode={flight.destination}
//                                 />
//                                 <SearchableAirportSelect
//                                     airports={airports}
//                                     selected={airports.find(
//                                         (a) => a.code === flight.destination
//                                     )}
//                                     onChange={(airport) => {
//                                         const updated = [...flights];
//                                         updated[index].destination =
//                                             airport?.code || "";
//                                         setFlights(updated);
//                                     }}
//                                     label="Destination"
//                                     excludeCode={flight.origin}
//                                 />
//                             </div>
//                             <FareCalendar
//                                 title="Select Date"
//                                 origin={flight.origin}
//                                 destination={flight.destination}
//                                 onSelectDate={(date) => {
//                                     const updated = [...flights];
//                                     updated[index].date = date;
//                                     setFlights(updated);
//                                 }}
//                             />
//                         </div>
//                     ))}
//                     {flights.length < 5 && (
//                         <button
//                             onClick={() =>
//                                 setFlights((prev) => [
//                                     ...prev,
//                                     { origin: "", destination: "", date: "" },
//                                 ])
//                             }
//                             className="text-blue-600 hover:underline text-sm"
//                         >
//                             ➕ Add Another Flight
//                         </button>
//                     )}
//                 </div>
//             )}

//             {/* Calendar for one-way and round-trip */}
//             <div className="grid grid-cols-2 gap-4 text-gray-800">
//                 {tripType !== "multi-city" && (
//                     <FareCalendar
//                         title="Select Departure Date"
//                         origin={flights[0].origin}
//                         destination={flights[0].destination}
//                         onSelectDate={(date) => {
//                             setSelectedDate(date);

//                             if (tripType === "round-trip") {
//                                 setRoundTripDates((prev) => ({
//                                     ...prev,
//                                     startDate: date,
//                                 }));
//                             }
//                             setFlights((prev) => [
//                                 { ...prev[0], date },
//                                 ...(tripType === "round-trip" ? [prev[1]] : []),
//                             ]);
//                         }}
//                     />
//                 )}
//                 {tripType === "round-trip" && (
//                     <FareCalendar
//                         title="Select Return Date"
//                         origin={flights[1].origin}
//                         destination={flights[1].destination}
//                         onSelectDate={(date) =>
//                             setRoundTripDates((prevDates) => ({
//                                 ...prevDates,
//                                 endDate: date,
//                             }))
//                         }
//                     />
//                 )}
//             </div>

//             {/* Search Button */}
//             <button
//                 onClick={handleSearch}
//                 disabled={loading}
//                 className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full text-lg font-semibold shadow-md hover:bg-blue-600 transition"
//             >
//                 {loading ? "Searching..." : "🚀 Search Flights"}
//             </button>

//             {/* Error Display */}
//             {error && <p className="text-red-500">{error}</p>}

//             {/* Alternative Flights */}
//             {alternativeFlights.length > 0 && (
//                 <div className="mt-6 bg-gray-100 p-4 rounded-lg">
//                     <h3 className="text-lg font-semibold">
//                         🔄 Alternative Flights Available
//                     </h3>
//                     {alternativeFlights.map((flight, index) => (
//                         <div
//                             key={index}
//                             className="flex items-center justify-between p-3 bg-white shadow-sm rounded-lg my-2"
//                         >
//                             <div>
//                                 <p className="text-md font-semibold">
//                                     ✈ {flight.flights.flight_number} -{" "}
//                                     {flight.flights.airline_id}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                     {
//                                         flight
//                                             .airports_flight_legs_origin_airport_idToairports
//                                             .name
//                                     }{" "}
//                                     →{" "}
//                                     {
//                                         flight
//                                             .airports_flight_legs_dest_airport_idToairports
//                                             .name
//                                     }
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                     🕒{" "}
//                                     {new Date(
//                                         flight.departure_time
//                                     ).toLocaleTimeString()}{" "}
//                                     -{" "}
//                                     {new Date(
//                                         flight.arrival_time
//                                     ).toLocaleTimeString()}{" "}
//                                     | ⏳ {flight.duration} mins
//                                 </p>
//                             </div>
//                             <div className="text-right">
//                                 <p className="text-lg font-bold text-green-600">
//                                     ₹{flight.flight_seats[0]?.price || "N/A"}
//                                 </p>
//                                 <button
//                                     onClick={() =>
//                                         router.push(
//                                             `/booking?flightId=${flight.id}`
//                                         )
//                                     }
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
//                                 >
//                                     ✈ Book Now
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
