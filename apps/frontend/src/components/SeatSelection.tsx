interface SeatSelectionProps {
    availableSeats: any[];
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
}

export default function SeatSelection({
    availableSeats,
    selectedSeats,
    setSelectedSeats,
}: SeatSelectionProps) {
    const toggleSeatSelection = (seat: string) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    return (
        <div className="border p-4 rounded-lg shadow-md bg-white mt-4">
            <h2 className="text-lg font-semibo ld">🪑 Select Seats</h2>
            <div className="grid grid-cols-4 gap-2 mt-2">
                {availableSeats.map((seat, index) => (
                    <button
                        key={index}
                        className={`border p-2 rounded-md text-center ${selectedSeats.includes(seat.seat_number) ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
                        onClick={() => toggleSeatSelection(seat.seat_number)}
                    >
                        {seat.seat_number}
                    </button>
                ))}
            </div>
        </div>
    );
}
