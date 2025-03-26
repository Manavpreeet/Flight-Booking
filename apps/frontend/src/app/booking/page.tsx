"use client";

export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useFlight } from "@/context/FlightContext";
import { api } from "@/lib/api";
import { Passenger, PassengerForm } from "@/components/PassengerForm";
import { SelectedFlightCard } from "@/components/SelectedFlightCard";
import { CancellationPolicy } from "@/components/CancellationPolicy";
import { FareSummarySidebar } from "@/components/FareSummarySidebar";
import { SuccessTicketCard } from "@/components/BookingCompletion";

import type {
    FlightLeg,
    ConnectingFlight,
    Segment,
    Seat,
} from "@/types/flight";
import { TripType } from "@/types/booking";

export default function BookingPage() {
    const { getSelectedFlight } = useFlight();
    const [selectedFlight, setSelectedFlight] = useState<any>(null);
    const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const searchParams = useSearchParams();
    const router = useRouter();

    const isConnecting = searchParams.get("isConnecting") === "true";
    const tripType = searchParams.get("trip_type") as TripType;

    useEffect(() => {
        const flight = getSelectedFlight();
        setSelectedFlight(flight);
        setTotalAmount(flight.totalAmount);
        if (!flight?.passengers) return;

        const { adults = 1, children = 0, infants = 0 } = flight.passengers;

        const createPassengers = (
            count: number,
            type: Passenger["passenger_type"]
        ) =>
            Array.from({ length: count }, () => ({
                name: "",
                age: "",
                passenger_type: type,
                is_disabled: true,
            }));

        setPassengerDetails([
            ...createPassengers(adults, "Adult"),
            ...createPassengers(children, "Child"),
            ...createPassengers(infants, "Infant"),
        ]);
    }, []);

    const isPassengerValid = (passenger: Passenger) => {
        const age = parseInt(passenger.age);
        if (!passenger.name.trim() || isNaN(age)) return false;

        switch (passenger.passenger_type) {
            case "Adult":
                return age >= 12;
            case "Child":
                return age >= 2 && age <= 11;
            case "Infant":
                return age < 2;
            default:
                return false;
        }
    };

    const isBookingDisabled =
        isBooking || passengerDetails.some((p) => !isPassengerValid(p));

    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
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

        const flights = selectedFlight.segments.flatMap((segment: Segment) => {
            const userFlights = segment.legs.map((leg: FlightLeg) => ({
                flight_leg_id: leg.id,
                seat_class: selectedFlight.classType,
                passengers: passengerDetails.map(
                    ({ name, age, passenger_type }) => ({
                        name,
                        age,
                        passenger_type,
                    })
                ),
            }));

            return [...userFlights];
        });

        console.log("BookingPage", selectedFlight);

        const bookingPayload = {
            user_id: parsedUser.id || parsedUser.user.id,
            trip_type: tripType,
            flights,
            total_amount: totalAmount * 1.18,
        };

        try {
            await api.post("/bookings", bookingPayload);
            localStorage.removeItem("pending_booking_data");
            setShowSuccess(true);
            setTimeout(() => {
                router.push("/my-bookings");
            }, 2500);
        } catch (err) {
            setError("Booking failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    if (!selectedFlight) {
        return (
            <p className="text-center text-red-500 mt-10">
                No flight selected.
            </p>
        );
    }

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
                    {selectedFlight.segments.map(
                        (segment: any, segmentIndex: number) => (
                            <div key={segmentIndex} className="space-y-4">
                                <SelectedFlightCard
                                    flightNumber={segmentIndex + 1}
                                    key={`${segmentIndex}`}
                                    isConnecting={segment.isConnecting}
                                    selectedFlight={segment.legs}
                                />
                            </div>
                        )
                    )}

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
                        disabled={isBookingDisabled}
                        className={`w-full font-semibold py-3 px-6 rounded-lg transition ${
                            isBookingDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                        {isBooking ? "Processing..." : "💳 Proceed to Payment"}
                    </motion.button>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-[320px] w-full">
                    <FareSummarySidebar
                        baseFare={totalAmount}
                        taxes={totalAmount * 0.18}
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
