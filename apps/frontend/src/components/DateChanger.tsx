"use client";

import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import toast from "react-hot-toast";

export default function DateChanger({
    bookingId,
    currentDate,
}: {
    bookingId: string;
    currentDate: string;
}) {
    const [date, setDate] = useState(currentDate.slice(0, 10));
    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/modify/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ departure_date: date }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Date updated");
            } else {
                toast.error(data.error || "Failed to update date");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-1 flex items-center gap-2">
                <MdCalendarToday /> Change Travel Date
            </h3>
            <div className="flex items-center gap-3">
                <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <button
                    onClick={handleChange}
                    disabled={loading || date === currentDate.slice(0, 10)}
                    className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );
}
