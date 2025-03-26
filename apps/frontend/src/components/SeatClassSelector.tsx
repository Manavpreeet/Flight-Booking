"use client";

import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const seatOptions = ["Economy", "Premium Economy", "Business", "First"];

export default function SeatClassSelector({
    bookingId,
    currentClass,
    flightLegId,
}: {
    bookingId: string;
    currentClass: string;
    flightLegId: string;
}) {
    const [selected, setSelected] = useState(currentClass);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (selected === currentClass) return;

        setLoading(true);
        try {
            const res = await api.patch(`/bookings/modify/${bookingId}`, {
                new_seat_class: selected,
                new_flight_leg_id: flightLegId,
            });
            const data = await res.data;
            if (res.data) {
                toast.success("Seat class updated");
            } else {
                toast.error(data.error || "Failed to update seat");
            }
        } catch (e) {
            toast.error(e.message || "Failed to update seat");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-1 flex items-center gap-2">
                <FiEdit3 /> Change Seat Class
            </h3>
            <div className="flex gap-3 items-center">
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    {seatOptions.map((option) => (
                        <option key={option}>{option}</option>
                    ))}
                </select>
                <button
                    onClick={handleUpdate}
                    disabled={loading || selected === currentClass}
                    className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );
}
