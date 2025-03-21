export interface Booking {
    booking_id: string;
    user_id: string;
    flight_id: string;
    pnr: string;
    seat_class: "Economy" | "Business" | "First";
    status: "Confirmed" | "Cancelled";
}
