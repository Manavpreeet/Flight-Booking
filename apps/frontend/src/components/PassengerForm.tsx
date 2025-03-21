interface PassengerFormProps {
    passengerInfo: { name: string; email: string; phone: string };
    setPassengerInfo: (info: any) => void;
}

export default function PassengerForm({
    passengerInfo,
    setPassengerInfo,
}: PassengerFormProps) {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white mt-4">
            <h2 className="text-lg font-semibold">🧑 Passenger Information</h2>
            <input
                type="text"
                placeholder="Full Name"
                className="border p-2 w-full rounded mt-2"
                value={passengerInfo.name}
                onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, name: e.target.value })
                }
            />
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full rounded mt-2"
                value={passengerInfo.email}
                onChange={(e) =>
                    setPassengerInfo({
                        ...passengerInfo,
                        email: e.target.value,
                    })
                }
            />
            <input
                type="tel"
                placeholder="Phone Number"
                className="border p-2 w-full rounded mt-2"
                value={passengerInfo.phone}
                onChange={(e) =>
                    setPassengerInfo({
                        ...passengerInfo,
                        phone: e.target.value,
                    })
                }
            />
        </div>
    );
}
