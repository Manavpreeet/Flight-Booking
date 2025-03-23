"use client";

import { useState } from "react";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";

export default function CancelButton({ bookingId }: { bookingId: string }) {
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/cancel/${bookingId}`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Booking cancelled");
            } else {
                toast.error(data.error || "Failed to cancel booking");
            }
        } catch (e) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-2 flex items-center gap-2 text-red-600">
                <MdCancel /> Cancel Booking
            </h3>
            {confirm ? (
                <div className="space-x-3">
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                    <button
                        onClick={() => setConfirm(false)}
                        className="border border-gray-300 px-3 py-1 rounded"
                    >
                        Nevermind
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setConfirm(true)}
                    className="text-red-500 underline text-sm"
                >
                    Cancel this booking
                </button>
            )}
        </div>
    );
}
