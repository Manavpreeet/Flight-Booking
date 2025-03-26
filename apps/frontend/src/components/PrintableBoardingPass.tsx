// components/PrintableBoardingPass.tsx
import React from "react";

const PrintableBoardingPass = React.forwardRef(function PrintableBoardingPass(
    { booking }: { booking: any },
    ref: React.Ref<HTMLDivElement>
) {
    return (
        <div ref={ref} className="p-6 w-[800px] bg-white text-black">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <p>
                <strong>Booking ID:</strong> {booking.id}
            </p>
            <p>
                <strong>E-Ticket:</strong> {booking.e_ticket_code}
            </p>
            <p>
                <strong>Status:</strong> {booking.status}
            </p>
            <p>
                <strong>Total Amount:</strong> ₹{booking.total_amount}
            </p>

            <h3 className="mt-4 font-semibold">Passengers</h3>
            <ul className="list-disc pl-6 mb-4">
                {booking.booking_passengers.map((p: any) => (
                    <li key={p.id}>
                        {p.name} ({p.passenger_type}, {p.age})
                    </li>
                ))}
            </ul>

            {booking.itineraries.itinerary_flights.map((segment: any) => {
                const leg = segment.flight_legs;
                return (
                    <div key={segment.id} className="mb-4 border-t pt-2">
                        <h4 className="font-semibold mb-1">
                            Segment {segment.segment_number}
                        </h4>
                        <p>
                            {
                                leg
                                    .airports_flight_legs_origin_airport_idToairports
                                    .code
                            }{" "}
                            →{" "}
                            {
                                leg
                                    .airports_flight_legs_dest_airport_idToairports
                                    .code
                            }
                        </p>
                        <p>Flight: {leg.flights.flight_number}</p>
                        <p>
                            Departure:{" "}
                            {new Date(leg.departure_time).toLocaleString()}
                        </p>
                        <p>
                            Arrival:{" "}
                            {new Date(leg.arrival_time).toLocaleString()}
                        </p>
                        <p>
                            Status:{" "}
                            {leg.flight_status_updates?.[0]?.status ||
                                "Scheduled"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
});

export default PrintableBoardingPass;
