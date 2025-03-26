"use client";

import { motion } from "framer-motion";
import { MdFlightTakeoff } from "react-icons/md";

interface SuccessTicketCardProps {
    flight: any;
    isConnecting: boolean;
}

export const SuccessTicketCard: React.FC<SuccessTicketCardProps> = ({
    flight,
    isConnecting,
}) => {
    console.log(
        "BookingCompletion",
        flight.segments[flight.segments.length - 1]
    );

    let origin = flight.segments[0].legs[0].origin_airport;
    let destination =
        flight.segments[flight.segments.length - 1].legs[
            flight.segments[flight.segments.length - 1].legs.length - 1
        ].destination_airport;

    let departureAt = flight.segments[0].legs[0].departure_time;
    let seatClass = flight.segments[0].legs[0].seats[0].cabin_class;
    let seatNumber = flight.segments[0].legs[0].seats[0].seat_number;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-50/90 bg-opacity-40"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-[350px] p-4 border text-gray-800 border-gray-200 relative">
                {/* Image / Banner */}
                <div className="rounded-2xl overflow-hidden  mb-4">
                    <img
                        src="https://ytjwfsvqxlgwnzmvukpf.supabase.co/storage/v1/object/public/images//philip-myrtorp-iiqpxCg2GD4-unsplash.jpg"
                        alt="flight"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Codes */}
                <div className="flex items-center justify-between px-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold">{origin?.code}</p>
                        <p className="text-xs text-gray-500">{origin?.city}</p>
                    </div>
                    <div className="text-purple-600 text-xl">
                        <MdFlightTakeoff />
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">
                            {destination?.code}
                        </p>
                        <p className="text-xs text-gray-500">
                            {destination?.city}
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-dashed" />

                {/* Details */}
                <div className="text-sm px-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Departure date</span>
                        <span className="font-semibold">
                            {new Date(departureAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-semibold">
                            {new Date(departureAt).toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Class</span>
                        <span className="font-semibold">{seatClass}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Seat</span>
                        <span className="font-semibold">{seatNumber}</span>
                    </div>
                </div>

                {/* Dotted line */}

                <hr className="my-4 border-dashed" />

                <div className="mt-4 px-4 flex items-center justify-center">
                    <img
                        src="https://ytjwfsvqxlgwnzmvukpf.supabase.co/storage/v1/object/public/images//49681292_9185593.png"
                        className=" rounded-lg w-full h-1/2 "
                    />
                </div>
            </div>
        </motion.div>
    );
};
