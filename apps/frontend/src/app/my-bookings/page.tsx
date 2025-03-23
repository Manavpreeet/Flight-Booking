"use client";

import { useEffect, useState } from "react";
import BookingCard from "@/components/BookingCard";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ChangeSeatClassModal from "@/components/ChangeSeatTypeModa";

type BookingStatus = "Upcoming" | "Cancelled" | "Completed";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<BookingStatus>("Upcoming");
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const tabs: BookingStatus[] = ["Upcoming", "Cancelled", "Completed"];

    useEffect(() => {
        if (!user && !token) {
            window.location.href = "/login";
            return;
        }

        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/bookings?user_id=${user.id}`);
            setBookings(response.data);
        } catch (err) {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId: string) => {
        try {
            await api.post(`/bookings/cancel/${bookingId}`);
            toast.success("Booking cancelled");
            fetchBookings();
        } catch (err) {
            toast.error("Failed to cancel booking");
        }
    };

    const handleChangeDate = async (bookingId: string) => {
        const formData = {}; // Add date modification logic/UI separately
        try {
            await api.patch(`/bookings/modify/${bookingId}`, formData);
            toast.success("Travel date updated");
            fetchBookings();
        } catch (err) {
            toast.error("Failed to update travel date");
        }
    };

    const isCompleted = (departureTime: string) => {
        return new Date(departureTime) < new Date();
    };

    const filterByTab = (booking: any): boolean => {
        const status = booking.status;
        const firstLeg =
            booking.itineraries?.itinerary_flights?.[0]?.flight_legs;
        const isPast = isCompleted(firstLeg?.departure_time);

        if (activeTab === "Cancelled") return status === "Cancelled";
        if (activeTab === "Completed") return status === "Confirmed" && isPast;
        return status === "Confirmed" && !isPast;
    };

    const getPassengerCount = (booking: any) =>
        booking.booking_passengers?.length || 1;

    const getFlightInfo = (booking: any) => {
        const segments = booking.itineraries?.itinerary_flights || [];
        const firstLeg = segments[0]?.flight_legs;
        const lastLeg = segments[segments.length - 1]?.flight_legs;

        return {
            origin: firstLeg?.airports_flight_legs_origin_airport_idToairports
                ?.city,
            destination:
                lastLeg?.airports_flight_legs_dest_airport_idToairports?.city,
            departureTime: firstLeg?.departure_time,
            arrivalTime: lastLeg?.arrival_time,
            airline: firstLeg?.flights?.airline_id?.includes("indigo")
                ? "IndiGo"
                : "Air India", // TODO: Replace with actual airline lookup if needed
            flightNumber: firstLeg?.flights?.flight_number,
        };
    };

    const filteredBookings = bookings.filter(filterByTab);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
            <div className="p-6 space-y-6 bg-white max-w-5xl mx-auto">
                <div className="text-sm text-gray-600 mb-2">
                    My Account &gt; My Trips
                </div>

                <div className="flex gap-4 mb-6 border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 font-medium transition-all duration-150 ${
                                activeTab === tab
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500 hover:text-blue-500"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-10">
                        Loading bookings...
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No bookings found
                    </div>
                ) : (
                    filteredBookings.map((booking) => {
                        const info = getFlightInfo(booking);

                        return (
                            <BookingCard
                                flightLegId={
                                    booking.itineraries?.itinerary_flights[0]
                                        ?.flight_legs.id
                                }
                                key={booking.id}
                                origin={info.origin}
                                destination={info.destination}
                                departureTime={info.departureTime}
                                arrivalTime={info.arrivalTime}
                                airline={info.airline}
                                flightNumber={info.flightNumber}
                                passengerCount={getPassengerCount(booking)}
                                tripType={booking.itineraries?.trip_type}
                                bookingId={booking.id}
                                status={
                                    booking.status === "Cancelled"
                                        ? "Cancelled"
                                        : isCompleted(info.departureTime)
                                          ? "Completed"
                                          : "Confirmed"
                                }
                                onCancel={() => handleCancel(booking.id)}
                                onChangeDate={() =>
                                    handleChangeDate(booking.id)
                                }
                                onManage={() => {
                                    window.location.href = `/booking/${booking.id}`;
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
