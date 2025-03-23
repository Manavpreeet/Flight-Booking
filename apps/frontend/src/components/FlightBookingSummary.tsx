interface FlightBookingSummaryProps {
    flight: any;
    isConnectingFlight: boolean;
}

export default function FlightBookingSummary({
    flight,
    isConnectingFlight,
}: FlightBookingSummaryProps) {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold">
                ✈ Flight {flight?.flights?.flight_number || "Unknown"}
            </h2>
            <p className="text-gray-600">
                {flight.origin_airport_id} → {flight.dest_airport_id}
            </p>
            <p className="text-gray-500">Departure: {flight.departure_time}</p>
            <p className="text-gray-500">Arrival: {flight.arrival_time}</p>
            <p className="text-gray-500">Duration: {flight.duration} mins</p>
            <p className="text-blue-600 font-bold">
                Price: ₹{flight.flight_seats[0]?.price || "N/A"}
            </p>

            {isConnectingFlight && (
                <p className="text-sm text-gray-400 mt-2">
                    This is a connecting flight
                </p>
            )}
        </div>
    );
}
