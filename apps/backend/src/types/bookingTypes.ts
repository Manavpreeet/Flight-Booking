export interface Booking {
    booking_id: string;
    user_id: string;
    flight_id: string;
    pnr: string;
    cabin_class: CabinClass;
    status: BookingStatus;
}

export type CabinClass = "Economy" | "Business" | "First";
export type TripType = "one-way" | "round-trip" | "multi-city";
export type BookingStatus =
    | "Confirmed"
    | "Cancelled"
    | "Completed"
    | "Modified";

export type BookingCardProps = {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    airline: string;
    flightNumber: string;
    passengerCount: number;
    tripType: TripType;
    bookingId: string;
    status: BookingStatus;
    onCancel?: () => void;
    onChangeDate?: () => void;
    onManage?: () => void;
    flightLegId: string; // NEW prop required
    segments?: any;
};
