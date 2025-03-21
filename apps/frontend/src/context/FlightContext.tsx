"use client";
import { createContext, useState, useContext, ReactNode } from "react";

// Flight Data Context
const FlightContext = createContext<any>(null);

// Flight Provider to wrap the app
export function FlightProvider({ children }: { children: ReactNode }) {
    const [selectedFlight, setSelectedFlight] = useState<any>(null);

    return (
        <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
            {children}
        </FlightContext.Provider>
    );
}

// Custom Hook to use Flight Context
export function useFlight() {
    return useContext(FlightContext);
}
