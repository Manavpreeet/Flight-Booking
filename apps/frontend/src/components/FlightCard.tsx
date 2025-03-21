interface FlightProps {
    flight: {
        flight_number: string;
        airline_id: string;
        total_seats: number;
        available_seats: number;
        status: string;
    };
    seats?: {
        seat_number: string;
        cabin_class: string;
        price: string;
        is_available: boolean;
    }[];
}

export default function FlightCard({ flight, seats }: FlightProps) {
    const availableSeats = seats?.filter((seat) => seat.is_available);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 border hover:shadow-xl transition flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold">
                    ✈ Flight {flight.flight_number}
                </h3>
                <p className="text-sm text-gray-500">Status: {flight.status}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                    Seats: {flight.available_seats}
                </p>
                {availableSeats && availableSeats.length > 0 ? (
                    <p className="text-sm text-green-600">
                        Starting at ₹{availableSeats[0].price}
                    </p>
                ) : (
                    <p className="text-sm text-red-500">No seats available</p>
                )}
            </div>
        </div>
    );
}
