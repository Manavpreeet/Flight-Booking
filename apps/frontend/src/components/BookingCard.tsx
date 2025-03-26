// components/BookingCard.tsx
"use client";

import BookingCardOneWay from "./BookingOneWayCard";
import RoundTripBookingCard from "./RoundTripCard";
import { BookingCardProps } from "@/types/booking"; // optional, abstract prop shape

export default function BookingCard(props: BookingCardProps) {
    console.log(props, "Booking Card Props");
    if (props.tripType === "round-trip" && "segments" in props) {
        return (
            <RoundTripBookingCard
                bookingId={props.bookingId}
                tripType="round-trip"
                passengerCount={props.passengerCount}
                status={props.status}
                onCancel={props.onCancel}
                segments={props.segments}
                onManage={props.onManage}
            />
        );
    }

    // Default fallback to one-way card
    return <BookingCardOneWay {...props} />;
}
