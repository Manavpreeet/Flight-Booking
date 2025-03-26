import { CabinClass, TripType } from "./booking";

export interface Flight {
    id: string;
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    price: number;
    available_seats: number;
}

export type GetFlightRoute = {
    origin: string;
    destination: string;
    date: string;
};

export type MultiCityRoute = GetFlightRoute;
export type RoundCityRoute = {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
};

export type OneWayRoute = {
    origin: string;
    destination: string;
    departureDate: string;
};
export type GetFlightsQuery = {
    number_of_passengers: number;
    trip_type: TripType;
    routes: string;
    cabin_class: CabinClass;
};

export type FlightSearchResponse = {
    segments: Segment[];
};

export type Segment = {
    direct_flights: FlightLeg[];
    connecting_flights: ConnectingFlight[];
};

export type FlightLeg = {
    id: string;
    flight_id: string;
    origin_airport: Airport;
    destination_airport: Airport;
    departure_time: string;
    arrival_time: string;
    leg_number: number;
    layover_time: number | null;
    duration: number;
    flight: FlightInfo;
    seats: Seat[];
};

export type ConnectingFlight = {
    legs: FlightLeg[];
};

export type Airport = {
    name: string;
    code: string;
    city: string;
    country: string;
};

export type FlightInfo = {
    id: string;
    flight_number: string;
    airline: Airline;
    total_seats: number;
    available_seats: number;
    status: string;
    created_at: string;
};

export type Airline = {
    id: string;
    name: string;
    code: string;
    country: string;
};

export type Seat = {
    id: string;
    flight_leg_id: string;
    cabin_class: string;
    seat_number: string;
    is_available: boolean;
    price: string;
    discount: string | null;
    reserved_until: string | null;
};
