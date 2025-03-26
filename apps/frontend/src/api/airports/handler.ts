import { api } from "@/lib/api";
import { GET_AIRPORTS } from "./route";
import { Airport } from "@/types/airport";

export const getAirports = async (): Promise<Airport[] | Error> => {
    try {
        const response = await api.get(GET_AIRPORTS);
        return response.data;
    } catch (e) {
        return new Error("Failed to fetch airports");
    }
};
