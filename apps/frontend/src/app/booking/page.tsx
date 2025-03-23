"use client";
export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { useFlight } from "@/context/FlightContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Passenger, PassengerForm } from "@/components/PassengerForm";
import { SelectedFlightCard } from "@/components/SelectedFlightCard";
import { CancellationPolicy } from "@/components/CancellationPolicy";
import { FareSummarySidebar } from "@/components/FareSummarySidebar";
import { SuccessTicketCard } from "@/components/BookingCompletion";

export default function BookingPage() {
    const { getSelectedFlight, setSelectedFlight } = useFlight();
    const [selectedFlight, setSelectedFlightState] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const isConnecting = searchParams.get("isConnecting") === "true";
    const tripType = searchParams.get("tripType");
    const [showSuccess, setShowSuccess] = useState(false);

    const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([
        { name: "", age: "", passenger_type: "Adult" },
    ]);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentFlight = getSelectedFlight();
        setSelectedFlightState(currentFlight);

        let adultPassengers =
            selectedFlight?.passengers?.adults > 0
                ? Array.from({ length: selectedFlight.passengers.adults }).map(
                      () => ({
                          name: "",
                          age: "",
                          passenger_type: "Adult" as const,
                          is_disabled: true,
                      })
                  )
                : [];

        let childPassengers =
            selectedFlight?.passengers?.children > 0
                ? Array.from({
                      length: selectedFlight.passengers.children,
                  }).map(() => ({
                      name: "",
                      age: "",
                      passenger_type: "Child" as const,
                      is_disabled: true,
                  }))
                : [];

        let infantPassengers =
            selectedFlight?.passengers?.infants > 0
                ? Array.from({ length: selectedFlight.passengers.infants }).map(
                      () => ({
                          name: "",
                          age: "",
                          passenger_type: "Infant" as const,
                          is_disabled: true,
                      })
                  )
                : [];

        setPassengerDetails([
            ...adultPassengers,
            ...childPassengers,
            ...infantPassengers,
        ]);
    }, [selectedFlight]);

    if (!selectedFlight) {
        return (
            <p className="text-center text-red-500 mt-10">
                No flight selected.
            </p>
        );
    }
    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            // Store pending booking data for post-login
            localStorage.setItem(
                "pending_booking_data",
                JSON.stringify({
                    selectedFlight,
                    passengerDetails,
                    isConnecting,
                })
            );
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(user);

        console.log("Selected Flight", selectedFlight);

        const bookingPayload = {
            user_id: parsedUser.id,
            trip_type: tripType,

            flights: isConnecting
                ? selectedFlight.segments.flatMap((segment) =>
                      segment.legs.map((leg) => ({
                          flight_leg_id: leg.id,
                          seat_class: selectedFlight.classType,
                          passengers: passengerDetails.map((passenger) => ({
                              name: passenger.name,
                              age: passenger.age,
                              passenger_type: passenger.passenger_type,
                          })),
                      }))
                  )
                : selectedFlight.segments.map((segment) => ({
                      flight_leg_id: segment.id,
                      seat_class: selectedFlight.classType,

                      passengers: passengerDetails.map((passenger) => ({
                          name: passenger.name,
                          age: passenger.age,
                          passenger_type: passenger.passenger_type,
                      })),
                  })),
            total_amount: isConnecting ? 15000 : 5000,
        };

        console.log("Booking Payload", bookingPayload);
        try {
            const response = await api.post("/bookings", bookingPayload);
            localStorage.removeItem("pending_booking_data");
            setShowSuccess(true);
            setTimeout(() => {
                // router.push("/my-bookings");
            }, 2500);
        } catch (err) {
            setError("Booking failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold text-center text-gray-800"
            >
                ✈ Complete Your Booking
            </motion.h1>

            <div className="mt-10 flex flex-col-reverse lg:flex-row gap-8">
                {/* Left Column */}
                <div className="flex-1 space-y-8">
                    {selectedFlight.segments.map((segment, index) => (
                        <SelectedFlightCard
                            key={index}
                            isConnecting={isConnecting}
                            selectedFlight={segment}
                        />
                    ))}

                    <PassengerForm
                        passengers={passengerDetails}
                        setPassengers={setPassengerDetails}
                    />

                    <CancellationPolicy />

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        {isBooking ? "Processing..." : "💳 Proceed to Payment"}
                    </motion.button>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-[320px] w-full">
                    <FareSummarySidebar
                        baseFare={isConnecting ? 13500 : 4500}
                        taxes={isConnecting ? 1500 : 500}
                    />
                </div>
            </div>
            {showSuccess && (
                <SuccessTicketCard
                    flight={selectedFlight}
                    isConnecting={isConnecting}
                />
            )}
        </div>
    );
}
