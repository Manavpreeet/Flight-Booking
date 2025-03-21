"use client";
export const dynamic = "force-dynamic"; // This forces dynamic rendering

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function ModifyBooking() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const [formData, setFormData] = useState({
        new_date: "",
        new_seat_class: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.patch(
                `/bookings/modify/${bookingId}`,
                formData
            );
            alert(response.data.message);
            router.push("/");
        } catch (error) {
            alert("Modification failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Modify Booking</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600">New Date</label>
                        <input
                            type="date"
                            name="new_date"
                            value={formData.new_date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600">
                            New Seat Class
                        </label>
                        <select
                            name="new_seat_class"
                            value={formData.new_seat_class}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Class</option>
                            <option value="Economy">Economy</option>
                            <option value="Business">Business</option>
                            <option value="First-Class">First-Class</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded w-full"
                    >
                        Confirm Changes
                    </button>
                </form>
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 mt-4 block w-full text-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
