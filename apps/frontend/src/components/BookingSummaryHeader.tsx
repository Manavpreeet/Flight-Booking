// components/BookingSummaryHeader.tsx
import {
    FaTicketAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
} from "react-icons/fa";
import { MdCancel, MdEdit, MdMoney } from "react-icons/md";
import { format } from "date-fns";

type BookingStatus = "Confirmed" | "Cancelled" | "Completed";

interface BookingSummaryHeaderProps {
    bookingId: string;
    eTicketCode: string;
    totalAmount: string;
    bookingDate: string;
    status: BookingStatus;
    onModify?: () => void;
    onCancel?: () => void;
}

export default function BookingSummaryHeader({
    bookingId,
    eTicketCode,
    totalAmount,
    bookingDate,
    status,
    onModify,
    onCancel,
}: BookingSummaryHeaderProps) {
    const getStatusIcon = () => {
        switch (status) {
            case "Confirmed":
                return <FaCheckCircle className="text-green-600" />;
            case "Cancelled":
                return <FaTimesCircle className="text-red-500" />;
            case "Completed":
                return <FaClock className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Left Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <FaTicketAlt className="text-indigo-600" />
                        Booking ID:{" "}
                        <span className="text-gray-700">{bookingId}</span>
                    </h2>
                    <p className="flex items-center text-sm text-gray-600 mb-1">
                        <FaCalendarAlt className="mr-2" />
                        Booking Date:{" "}
                        {format(new Date(bookingDate), "dd MMM yyyy, hh:mm a")}
                    </p>
                    <p className="flex items-center text-sm text-gray-600 mb-1">
                        <FaTicketAlt className="mr-2" />
                        E-Ticket:{" "}
                        <span className="font-medium">{eTicketCode}</span>
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                        <MdMoney className="mr-2" />
                        Total Paid: ₹{totalAmount}
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-gray-100 border">
                        {getStatusIcon()}
                        {status}
                    </div>
                </div>
            </div>
        </div>
    );
}
