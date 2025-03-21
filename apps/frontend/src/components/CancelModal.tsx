"use client";
import { api } from "@/lib/api";

export default function CancelModal({
    bookingId,
    onClose,
}: {
    bookingId: string;
    onClose: () => void;
}) {
    const handleCancel = async () => {
        try {
            const response = await api.post(`/bookings/cancel/${bookingId}`);
            alert(
                `Booking Cancelled. Refund: $${response.data.refund_amount} (${response.data.refund_percentage}%)`
            );
            window.location.reload();
        } catch (error) {
            alert("Cancellation failed.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                <h2 className="text-xl font-bold">Confirm Cancellation</h2>
                <p className="text-gray-600">
                    Are you sure you want to cancel this booking?
                </p>
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded"
                    >
                        No
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
