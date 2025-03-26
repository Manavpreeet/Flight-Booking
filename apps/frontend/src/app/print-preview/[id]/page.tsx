// app/print-preview/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api"; // Adjust if your API call path differs

export default function PrintPreviewPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                setBooking(res.data);
            } catch (err) {
                console.error("Failed to fetch booking", err);
            } finally {
                setLoading(false);
                setTimeout(() => {
                    window.print();
                }, 300); // give time for DOM to render
            }
        };

        fetchBooking();
    }, [id]);

    if (loading || !booking) {
        return (
            <p className="text-center mt-8 text-gray-500">
                Preparing your boarding pass...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 pt-4 print:p-0">
            <div className="p-6 max-w-3xl mx-auto bg-white text-black print:bg-white print:text-black">
                <h1 className="text-2xl font-bold mb-2">Booking Summary</h1>
                <p>
                    <strong>Booking ID:</strong> {booking.id}
                </p>
                <p>
                    <strong>E-Ticket:</strong> {booking.e_ticket_code}
                </p>
                <p>
                    <strong>Status:</strong> {booking.status}
                </p>
                <p>
                    <strong>Paid:</strong> ₹{booking.total_amount}
                </p>

                <h2 className="mt-4 text-xl font-semibold">Passengers</h2>
                <ul className="list-disc pl-5">
                    {booking.booking_passengers.map((p: any) => (
                        <li key={p.id}>
                            {p.name} ({p.passenger_type}, {p.age})
                        </li>
                    ))}
                </ul>

                <h2 className="mt-6 text-xl font-semibold">Flight Details</h2>
                {booking.itineraries.itinerary_flights.map((segment: any) => {
                    const leg = segment.flight_legs;
                    return (
                        <div key={segment.id} className="mt-4 border-t pt-2">
                            <h4 className="font-semibold mb-1">
                                Segment {segment.segment_number}
                            </h4>
                            <p>
                                {
                                    leg
                                        .airports_flight_legs_origin_airport_idToairports
                                        .code
                                }{" "}
                                →{" "}
                                {
                                    leg
                                        .airports_flight_legs_dest_airport_idToairports
                                        .code
                                }
                            </p>
                            <p>Flight: {leg.flights.flight_number}</p>
                            <p>
                                Departure:{" "}
                                {new Date(leg.departure_time).toLocaleString()}
                            </p>
                            <p>
                                Arrival:{" "}
                                {new Date(leg.arrival_time).toLocaleString()}
                            </p>
                            <p>
                                Status:{" "}
                                {leg.flight_status_updates?.[0]?.status ||
                                    "Scheduled"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
