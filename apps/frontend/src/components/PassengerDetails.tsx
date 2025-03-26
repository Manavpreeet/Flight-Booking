// components/PassengerDetails.tsx
import { FaUser, FaChair } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

interface Passenger {
    id: string;
    name: string;
    age: number;
    passenger_type: string;
    passport_number?: string | null;
}

interface FlightLegSeat {
    seat_number: string;
    cabin_class: string;
}

interface PassengerDetailsProps {
    passengers: Passenger[];
    segmentSeats: {
        [segmentNumber: number]: {
            [passengerId: string]: FlightLegSeat;
        };
    };
}

export default function PassengerDetails({
    passengers,
    segmentSeats,
}: PassengerDetailsProps) {
    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-indigo-600" />
                Passenger Details
            </h3>
            <div className="space-y-4">
                {passengers.map((p) => (
                    <div
                        key={p.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <p className="font-medium text-gray-800">
                                    {p.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {p.passenger_type}, {p.age} years old
                                </p>
                                {p.passport_number && (
                                    <p className="text-sm text-gray-500">
                                        Passport: {p.passport_number}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-600">
                                {Object.entries(segmentSeats).map(
                                    ([segmentNumber, segmentData]) => {
                                        const seat = segmentData[p.id];
                                        return (
                                            seat && (
                                                <div
                                                    key={segmentNumber}
                                                    className="flex items-center gap-1 bg-white border rounded px-3 py-1"
                                                >
                                                    <MdAirlineSeatReclineNormal className="text-blue-600" />
                                                    Segment {segmentNumber}:{" "}
                                                    {seat.cabin_class} - Seat{" "}
                                                    {seat.seat_number}
                                                </div>
                                            )
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
