"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CancelModal from "./CancelModal";
import { useRouter } from "next/navigation";

interface FlightLeg {
    departure_time: string;
    arrival_time: string;
    origin_airport_id: string;
    dest_airport_id: string;
}

interface ItineraryFlight {
    flight_legs: FlightLeg;
}

interface Itinerary {
    trip_type: string;
    itinerary_flights: ItineraryFlight[];
}

interface Booking {
    id: string;
    status: string;
    booking_date: string;
    e_ticket_code: string;
    itineraries: Itinerary | null;
}

export default function MyFlights() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            if (!user) return;
            try {
                const response = await api.get(`/bookings?user_id=${user.id}`);
                setBookings(response.data);
            } catch (err) {
                setError("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();

        // ✅ Subscribe to SSE for live flight status updates
        const eventSource = new EventSource(
            "http://localhost:5001/api/flights/status/subscribe"
        );

        eventSource.onmessage = (event) => {
            const { flightId, status } = JSON.parse(event.data);
            console.log(
                `Received SSE update: Flight ${flightId} is now ${status}`
            );

            // Update the flight status in local state
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === flightId ? { ...booking, status } : booking
                )
            );
        };

        eventSource.onerror = () => {
            console.error("SSE connection lost. Reconnecting...");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [user]);

    if (loading)
        return <p className="text-gray-600 text-center">Loading flights...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    const currentDate = new Date();

    const getDepartureTime = (booking: Booking) => {
        return (
            booking.itineraries?.itinerary_flights[0]?.flight_legs
                .departure_time || null
        );
    };

    const upcomingFlights = bookings.filter(
        (booking) =>
            booking.status === "Confirmed" &&
            getDepartureTime(booking) &&
            new Date(getDepartureTime(booking)!) > currentDate
    );

    const pastFlights = bookings.filter(
        (booking) =>
            booking.status === "Confirmed" &&
            getDepartureTime(booking) &&
            new Date(getDepartureTime(booking)!) < currentDate
    );

    const cancelledFlights = bookings.filter(
        (booking) => booking.status === "Cancelled"
    );
    const modifiedFlights = bookings.filter(
        (booking) => booking.status === "Modified"
    );

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                ✈️ My Flights
            </h2>

            <FlightList
                title="Upcoming Flights"
                icon="🟢"
                flights={upcomingFlights}
                noDataMessage="No upcoming flights found."
            />
            <FlightList
                title="Past Flights"
                icon="🔵"
                flights={pastFlights}
                noDataMessage="No past flights."
            />
            <FlightList
                title="Cancelled Flights"
                icon="🔴"
                flights={cancelledFlights}
                noDataMessage="No cancelled flights."
            />
            <FlightList
                title="Modified Flights"
                icon="🔄"
                flights={modifiedFlights}
                noDataMessage="No modified flights."
            />
        </div>
    );
}

// 🏷️ Reusable Flight List Component
function FlightList({
    title,
    icon,
    flights,
    noDataMessage,
}: {
    title: string;
    icon: string;
    flights: Booking[];
    noDataMessage: string;
}) {
    return (
        <div>
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                {icon} {title}
            </h3>
            {flights.length === 0 ? (
                <p className="text-gray-500">{noDataMessage}</p>
            ) : (
                <ul className="space-y-4">
                    {flights.map((flight) => (
                        <FlightItem key={flight.id} flight={flight} />
                    ))}
                </ul>
            )}
        </div>
    );
}

// 🏷️ Flight Item Component with Modify & Cancel Buttons
function FlightItem({ flight }: { flight: Booking }) {
    const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
    const router = useRouter();

    const departureTime =
        flight.itineraries?.itinerary_flights[0]?.flight_legs.departure_time;

    return (
        <li className="p-4 border rounded-md shadow-sm bg-gray-50">
            <p className="font-medium text-lg">
                E-Ticket: {flight.e_ticket_code}
            </p>
            <p className="text-gray-600">
                Departure:{" "}
                {departureTime
                    ? new Date(departureTime).toLocaleString()
                    : "Unknown"}
            </p>
            <p
                className={`text-md font-semibold ${
                    flight.status === "Cancelled"
                        ? "text-red-500"
                        : "text-green-600"
                }`}
            >
                Status: {flight.status}
            </p>
            {flight.status === "Confirmed" && (
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() =>
                            router.push(
                                `/booking/modify?bookingId=${flight.id}`
                            )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm"
                    >
                        Modify
                    </button>
                    <button
                        onClick={() => setCancelBookingId(flight.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {cancelBookingId && (
                <CancelModal
                    bookingId={cancelBookingId}
                    onClose={() => setCancelBookingId(null)}
                />
            )}
        </li>
    );
}
