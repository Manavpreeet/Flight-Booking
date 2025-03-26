import { FlightSearchResponse, GetFlightsQuery } from "@/types/flight";
import { GET_FLIGHTS } from "./route";
import { api } from "@/lib/api";

export const getFlights = async (
    query: string
): Promise<FlightSearchResponse | Error> => {
    try {
        const response = await api.get(GET_FLIGHTS + "?" + query);
        return response.data;
    } catch (e) {
        console.log(e);
        return new Error("Failed to fetch flights");
    }
};
