"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useFlight } from "@/context/FlightContext";
import { useState } from "react";
import { api } from "@/lib/api";

export default function BookingPage() {
    const { selectedFlight } = useFlight();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isConnecting = searchParams.get("isConnecting") === "true";

    const [passengerDetails, setPassengerDetails] = useState([
        { name: "", age: "", passenger_type: "Adult" },
    ]);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!selectedFlight) {
        return (
            <p className="text-center text-red-500 mt-10">
                No flight selected.
            </p>
        );
    }

    const handlePassengerChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const updatedPassengers = [...passengerDetails];
        updatedPassengers[index][field] = value;
        setPassengerDetails(updatedPassengers);
    };

    const handleAddPassenger = () => {
        setPassengerDetails([
            ...passengerDetails,
            { name: "", age: "", passenger_type: "Adult" },
        ]);
    };

    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        const bookingPayload = {
            user_id: "2129a7a8-7386-42a5-a3c3-643e2a9f7510", // Placeholder user ID
            trip_type: "one-way",
            flights: isConnecting
                ? [
                      {
                          flight_leg_id: selectedFlight.firstLeg.id,
                          seat_class: "Economy",
                          passengers: passengerDetails,
                      },
                      {
                          flight_leg_id: selectedFlight.secondLeg.id,
                          seat_class: "Economy",
                          passengers: passengerDetails,
                      },
                  ]
                : [
                      {
                          flight_leg_id: selectedFlight.id,
                          seat_class: "Economy",
                          passengers: passengerDetails,
                      },
                  ],
            total_amount: isConnecting ? 15000 : 5000,
        };

        try {
            const response = await api.post("/bookings", bookingPayload);
            router.push("/"); // Redirect to confirmation page
        } catch (err) {
            setError("Booking failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
                ✈ Flight Booking
            </h1>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Selected Flight</h2>
                <p className="text-gray-600">
                    {isConnecting ? "Connecting Flight" : "Direct Flight"}
                </p>
                <p className="text-gray-800 font-semibold">
                    {isConnecting
                        ? `${selectedFlight.firstLeg.flights.flight_number} → ${selectedFlight.secondLeg.flights.flight_number}`
                        : selectedFlight.flights.flight_number}
                </p>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Passenger Details</h2>
                {passengerDetails.map((passenger, index) => (
                    <div key={index} className="flex space-x-4 mt-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={passenger.name}
                            onChange={(e) =>
                                handlePassengerChange(
                                    index,
                                    "name",
                                    e.target.value
                                )
                            }
                            className="border p-2 rounded-md w-1/3"
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={passenger.age}
                            onChange={(e) =>
                                handlePassengerChange(
                                    index,
                                    "age",
                                    e.target.value
                                )
                            }
                            className="border p-2 rounded-md w-1/3"
                        />
                        <select
                            value={passenger.passenger_type}
                            onChange={(e) =>
                                handlePassengerChange(
                                    index,
                                    "passenger_type",
                                    e.target.value
                                )
                            }
                            className="border p-2 rounded-md w-1/3"
                        >
                            <option value="Adult">Adult</option>
                            <option value="Child">Child</option>
                            <option value="Infant">Infant</option>
                        </select>
                    </div>
                ))}
                <button
                    onClick={handleAddPassenger}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    ➕ Add Passenger
                </button>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <button
                onClick={handleBooking}
                className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition w-full"
                disabled={isBooking}
            >
                {isBooking ? "Processing..." : "💳 Proceed to Payment"}
            </button>
        </div>
    );
}
