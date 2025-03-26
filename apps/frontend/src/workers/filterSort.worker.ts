// app/workers/filterSort.worker.ts

export type Flight = any;
export type Filters = {
    airlines: string[];
    stops: "any" | "non-stop" | "1 stop" | "2+ stops";
    priceRange: [number, number];
};

export type WorkerInput = {
    segmentKey: string;
    flights: Flight[];
    filters: Filters;
    activeSort: "cheapest" | "fastest";
};

const applyFiltersAndSort = ({ flights, filters, activeSort }: WorkerInput) => {
    return flights
        .filter((flight) => {
            const isConnecting = Array.isArray(flight.legs);
            const legs = isConnecting ? flight.legs : [flight];

            const matchesAnyLeg = legs.some((leg) => {
                const airline = leg.flights?.airlines?.name || "Unknown";
                const stops = legs.length - 1;

                const matchesAirline =
                    filters.airlines.length === 0 ||
                    filters.airlines.includes(airline);

                const matchesStops =
                    filters.stops === "any" ||
                    (filters.stops === "non-stop" && stops === 0) ||
                    (filters.stops === "1 stop" && stops === 1) ||
                    (filters.stops === "2+ stops" && stops >= 2);

                const totalPrice = legs.reduce(
                    (sum, leg) =>
                        sum + parseInt(leg.flight_seats?.[0]?.price || "0"),
                    0
                );

                const matchesPrice =
                    totalPrice >= filters.priceRange[0] &&
                    totalPrice <= filters.priceRange[1];

                return matchesAirline && matchesStops && matchesPrice;
            });

            return matchesAnyLeg;
        })
        .sort((a, b) => {
            const getTotal = (
                type: "price" | "duration",
                flight: any
            ): number => {
                const legs = Array.isArray(flight.legs)
                    ? flight.legs
                    : [flight];
                return legs.reduce((acc: number, leg: any) => {
                    if (type === "price")
                        return (
                            acc + parseInt(leg.flight_seats?.[0]?.price || "0")
                        );
                    if (type === "duration") return acc + (leg.duration || 0);
                    return acc;
                }, 0);
            };

            const totalA = getTotal(
                activeSort === "cheapest" ? "price" : "duration",
                a
            );
            const totalB = getTotal(
                activeSort === "cheapest" ? "price" : "duration",
                b
            );
            return totalA - totalB;
        });
};

onmessage = function (e: MessageEvent) {
    const { segmentKey, ...rest } = e.data;
    const result = applyFiltersAndSort(rest);
    postMessage({ segmentKey, result });
};
