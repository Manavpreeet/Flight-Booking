// components/BookingDetailsCard.tsx
"use client";

import { useMemo } from "react";
import BookingSummaryHeader from "./BookingSummaryHeader";
import PassengerDetails from "./PassengerDetails";
import BoardingPassCard from "./BoardingPassCard";
import DownloadPdfButton from "./DownloadPdfButton";
import Link from "next/link";

export default function BookingDetailsCard({ booking }: { booking: any }) {
    const passengers = booking.booking_passengers;
    const itineraryFlights = booking.itineraries.itinerary_flights;

    // 🔍 Prepare passenger seat map per segment
    const segmentSeats = useMemo(() => {
        const seatMap: {
            [segmentNumber: number]: {
                [passengerId: string]: {
                    seat_number: string;
                    cabin_class: string;
                };
            };
        } = {};

        itineraryFlights.forEach((segment: any) => {
            const segmentNumber = segment.segment_number;
            const seats = segment.flight_legs.flight_seats;
            const legSeats = {};

            passengers.forEach((p: any) => {
                const seat = seats.find((s: any) => !s.is_available); // Simplified for now
                if (seat) {
                    legSeats[p.id] = {
                        seat_number: seat.seat_number,
                        cabin_class: seat.cabin_class,
                    };
                }
            });

            seatMap[segmentNumber] = legSeats;
        });

        return seatMap;
    }, [booking]);

    return (
        <div className="space-y-4 px-4 md:px-8 pb-12">
            {/* Top Summary */}
            <BookingSummaryHeader
                bookingId={booking.id}
                eTicketCode={booking.e_ticket_code}
                totalAmount={booking.total_amount}
                bookingDate={booking.booking_date}
                status={booking.status}
            />

            {/* Passenger Info */}
            <PassengerDetails
                passengers={passengers}
                segmentSeats={segmentSeats}
            />

            {/* Boarding Passes */}
            {itineraryFlights.map((segment: any) => {
                const leg = segment.flight_legs;
                return (
                    <BoardingPassCard
                        key={segment.id}
                        segmentNumber={segment.segment_number}
                        origin={
                            leg.airports_flight_legs_origin_airport_idToairports
                        }
                        destination={
                            leg.airports_flight_legs_dest_airport_idToairports
                        }
                        flightNumber={leg.flights.flight_number}
                        airline={leg.flights.airline_id.slice(0, 6)} // ideally replace with actual airline name
                        departure={leg.departure_time}
                        arrival={leg.arrival_time}
                        duration={leg.duration}
                        layover={leg.layover_time}
                        status={leg.flight_status_updates?.[0]?.status}
                        passengerSeats={segmentSeats[segment.segment_number]}
                    />
                );
            })}

            <Link
                href={`/print-preview/${booking.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                target="_blank"
            >
                Download Boarding Pass (PDF)
            </Link>

            {/* Static Ad or Info Section */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border rounded-xl p-4 text-sm text-gray-700">
                ✈️ <strong>Travel Tip:</strong> Reach the airport at least 2
                hours before departure. Carry valid ID proof. For assistance,
                call our 24/7 helpdesk.
            </div>
        </div>
    );
}
