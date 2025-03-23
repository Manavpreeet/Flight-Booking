import { create } from "zustand";

type StatusMap = Record<string, string>;

type FlightStatusStore = {
    statusMap: StatusMap;
    updateStatus: (flightId: string, status: string) => void;
};

export const useFlightStatusStore = create<FlightStatusStore>((set) => ({
    statusMap: {},
    updateStatus: (flightId, status) =>
        set((state) => ({
            statusMap: {
                ...state.statusMap,
                [flightId]: status,
            },
        })),
}));
