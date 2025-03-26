// app/utils/createFilterWorker.ts
export const createFilterWorker = () => {
    const workerCode = `
      self.onmessage = function (e) {
        const { segmentKey, flights, filters, activeSort } = e.data;
  
        const result = flights
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
            const getTotal = (type, flight) => {
              const legs = Array.isArray(flight.legs) ? flight.legs : [flight];
              return legs.reduce((acc, leg) => {
                if (type === "price") {
                  return acc + parseInt(leg.flight_seats?.[0]?.price || "0");
                }
                if (type === "duration") {
                  return acc + (leg.duration || 0);
                }
                return acc;
              }, 0);
            };
  
            const totalA = getTotal(activeSort === "cheapest" ? "price" : "duration", a);
            const totalB = getTotal(activeSort === "cheapest" ? "price" : "duration", b);
            return totalA - totalB;
          });
  
        self.postMessage({ segmentKey, result });
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    return new Worker(workerUrl);
};
