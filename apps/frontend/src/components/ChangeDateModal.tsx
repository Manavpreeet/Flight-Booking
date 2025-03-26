"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import DepartureDatePicker from "./DeparDatePicker";

export default function ChangeDateModal({
    isOpen,
    onClose,
    booking,
    onSuccess,
    passengerCount,
}: {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    onSuccess?: () => void;
    passengerCount: number;
}) {
    if (!booking) return null;
    const tripType = booking.itineraries.trip_type;
    const itineraryFlights = booking.itineraries.itinerary_flights;

    const firstLeg = itineraryFlights[0].flight_legs;
    const lastLeg = itineraryFlights.at(-1).flight_legs;

    const origin =
        firstLeg.airports_flight_legs_origin_airport_idToairports.code;
    const destination =
        lastLeg.airports_flight_legs_dest_airport_idToairports.code;

    const cabinClass = firstLeg.flight_seats?.[0]?.cabin_class || "Economy";

    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmMode, setConfirmMode] = useState(false);
    const [selectedNewFlight, setSelectedFlight] = useState<any[]>([]);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const reset = () => {
        setDepartureDate("");
        setReturnDate("");
        setLoading(false);
        setConfirmMode(false);
        setSelectedFlight([]);
    };

    const handleSearch = async () => {
        if (!departureDate || (tripType === "round-trip" && !returnDate)) {
            toast.error("Please select all required dates.");
            return;
        }

        const routeQuery =
            tripType === "round-trip"
                ? [
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
                  ]
                : [
                      {
                          origin,
                          destination,
                          date: departureDate,
                      },
                  ];

        const query = new URLSearchParams({
            trip_type: tripType,
            routes: JSON.stringify(routeQuery),
            cabin_class: "Economy",
            number_of_passengers: `${passengerCount || 1}`,
        }).toString();

        try {
            setLoading(true);
            const res = await api.get(`/flights?${query}`);
            let isAvailable = false,
                newFlightLegId = null;
            if (tripType === "one-way") {
                let data = await res.data.segment_1;
                let directFlights = data.directFlights;
                if (directFlights.length === 0) {
                    throw new Error("No direct flights available");
                }
                let sameDirectFlight = directFlights.find((flight: any) => {
                    if (
                        new Date(flight.departure_time).toLocaleTimeString() ===
                            new Date(
                                firstLeg.departure_time
                            ).toLocaleTimeString() &&
                        new Date(flight.arrival_time).toLocaleDateString() !==
                            new Date(
                                firstLeg.arrival_time
                            ).toLocaleDateString() &&
                        flight?.flights?.id === firstLeg.flight_id
                    )
                        return flight;
                });
                console.log("Same Direct Flight", sameDirectFlight);

                (isAvailable = true), (newFlightLegId = sameDirectFlight.id);

                if (!(isAvailable && newFlightLegId)) {
                    toast.error("Search in connecting flights");
                }
            }

            if (isAvailable && newFlightLegId) {
                setSelectedFlight([newFlightLegId]);
                setConfirmMode(true);
            } else {
                toast.error("No flights available for selected date(s).");
            }
        } catch (err) {
            console.log(err, "ERROR");
            toast.error("No flights available for selected date(s).");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        const patchDate = departureDate; // For now, only using departure date
        try {
            setLoading(true);
            console.log("Selected Flight", cabinClass);
            const res = await api.patch(`/bookings/modify/${booking.id}`, {
                new_flight_leg_id: selectedNewFlight[0],
                new_date: patchDate,
                new_seat_class: cabinClass,
            });
            if (!res.data) throw new Error("Failed");
            toast.success("Travel date updated successfully!");
            onClose();
            onSuccess?.();
        } catch (err) {
            toast.error("Failed to modify booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/55 text-gray-800 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            {confirmMode
                                ? "Confirm Travel Date Change"
                                : "Change Travel Date"}
                        </h2>

                        {!confirmMode ? (
                            <div className="space-y-4">
                                <DepartureDatePicker
                                    title="New Departure Date"
                                    selectedDate={departureDate}
                                    onDateChange={setDepartureDate}
                                    origin={origin}
                                    destination={destination}
                                    seatType={cabinClass}
                                />

                                {tripType === "round-trip" && (
                                    <DepartureDatePicker
                                        title="New Return Date"
                                        selectedDate={returnDate}
                                        onDateChange={setReturnDate}
                                        origin={destination}
                                        destination={origin}
                                        seatType={cabinClass}
                                        hiddenFromDate={
                                            departureDate
                                                ? new Date(departureDate)
                                                : undefined
                                        }
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm text-gray-700">
                                <p>
                                    ✈️ <b>Route:</b> {origin} → {destination}
                                </p>
                                <p>
                                    📅 <b>New Departure Date:</b>{" "}
                                    {departureDate}
                                </p>
                                {tripType === "round-trip" && (
                                    <p>
                                        📅 <b>New Return Date:</b> {returnDate}
                                    </p>
                                )}
                                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-md text-yellow-800">
                                    ⚠️ You will be charged <b>₹2000</b> to
                                    change your travel date.
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={confirmMode ? reset : onClose}
                                className="px-4 py-2 text-gray-600 hover:underline"
                            >
                                Cancel
                            </button>

                            {confirmMode ? (
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? "Updating..." : "Confirm"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Searching..."
                                        : "Search Flights"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
