"use client";
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

// Context type (optional if you're fine with `any`)
type FlightData = any;

const FlightContext = createContext<{
    selectedFlight: FlightData | null;
    setSelectedFlight: (flight: FlightData) => void;
    getSelectedFlight: () => FlightData | null;
}>({
    selectedFlight: null,
    setSelectedFlight: () => {},
    getSelectedFlight: () => null,
});

export function FlightProvider({ children }: { children: ReactNode }) {
    const [selectedFlight, _setSelectedFlight] = useState<FlightData | null>(
        null
    );

    // Update both state and localStorage
    const setSelectedFlight = (flight: FlightData) => {
        _setSelectedFlight(flight);
        localStorage.setItem("selectedFlight", JSON.stringify(flight));
    };

    const getSelectedFlight = () => {
        if (selectedFlight) return selectedFlight;

        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("selectedFlight");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (err) {
                return null;
            }
        }

        return null;
    };

    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ guard for SSR

        const stored = localStorage.getItem("selectedFlight");
        if (stored && !selectedFlight) {
            try {
                const parsed = JSON.parse(stored);
                _setSelectedFlight(parsed);
            } catch (err) {
                console.error("Invalid flight data in localStorage", err);
            }
        }
    }, []);

    return (
        <FlightContext.Provider
            value={{
                selectedFlight,
                setSelectedFlight,
                getSelectedFlight,
            }}
        >
            {children}
        </FlightContext.Provider>
    );
}

export function useFlight() {
    return useContext(FlightContext);
}
