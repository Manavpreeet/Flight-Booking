// app/booking/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookingDetailsCard from "@/components/BookingDetailsCard";
import { api } from "@/lib/api";

export default function BookingDetailsPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                const data = res.data;
                setBooking(data);
            } catch (err) {
                console.error("Failed to fetch booking", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return <p className="text-center">Loading booking...</p>;
    if (!booking) return <p className="text-center">Booking not found.</p>;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 pt-4">
            <BookingDetailsCard booking={booking} />;
        </div>
    );
}
