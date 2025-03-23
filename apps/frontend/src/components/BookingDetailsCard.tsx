"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MdFlight, MdCancel, MdCalendarToday } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import SeatClassSelector from "./SeatClassSelector";
import DateChanger from "./DateChanger";
import CancelButton from "./CancelButton";

export default function BookingDetailsCard({ booking }: { booking: any }) {
    const flightLeg = booking.itineraries.itinerary_flights[0].flight_legs;
    const passenger = booking.booking_passengers[0];
    const currentSeatClass = flightLeg.flight_seats[0].cabin_class;

    const origin = flightLeg.airports_flight_legs_origin_airport_idToairports;
    const dest = flightLeg.airports_flight_legs_dest_airport_idToairports;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-white shadow rounded-xl p-6 space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
                    <MdFlight /> {origin.city} → {dest.city}
                </h2>
                <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    {booking.status}
                </span>
            </div>

            <div className="text-gray-700 space-y-2">
                <p>
                    <strong>Airline:</strong> {flightLeg.flights.flight_number}
                </p>
                <p>
                    <strong>Departure:</strong>{" "}
                    {format(
                        new Date(flightLeg.departure_time),
                        "dd MMM yyyy, hh:mm a"
                    )}
                </p>
                <p>
                    <strong>Arrival:</strong>{" "}
                    {format(
                        new Date(flightLeg.arrival_time),
                        "dd MMM yyyy, hh:mm a"
                    )}
                </p>
                <p>
                    <strong>Total Fare:</strong> ₹{booking.total_amount}
                </p>
            </div>

            <div className="border-t pt-4 space-y-2">
                <h3 className="text-md font-semibold flex items-center gap-2">
                    <FaUser /> Passenger Details
                </h3>
                <div className="text-sm">
                    <p>
                        <strong>Name:</strong> {passenger.name}
                    </p>
                    <p>
                        <strong>Age:</strong> {passenger.age}
                    </p>
                    <p>
                        <strong>Type:</strong> {passenger.passenger_type}
                    </p>
                </div>
            </div>

            {/* 🛫 Seat Class Update */}
            <SeatClassSelector
                bookingId={booking.id}
                currentClass={currentSeatClass}
            />

            {/* 📅 Date Change */}
            <DateChanger
                bookingId={booking.id}
                currentDate={flightLeg.departure_time}
            />

            {/* ❌ Cancel Booking */}
            <CancelButton bookingId={booking.id} />
        </motion.div>
    );
}
