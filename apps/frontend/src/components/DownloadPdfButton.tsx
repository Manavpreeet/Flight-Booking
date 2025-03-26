// components/DownloadPdfButton.tsx
"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableBoardingPass from "./PrintableBoardingPass";
import { FaDownload } from "react-icons/fa";

export default function DownloadPdfButton({ booking }: { booking: any }) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `booking-${booking.e_ticket_code}`,
        removeAfterPrint: true,
    });

    return (
        <>
            <div className="text-right my-4">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                    <FaDownload />
                    Download Boarding Pass
                </button>
            </div>

            <div style={{ display: "none" }}>
                <PrintableBoardingPass ref={componentRef} booking={booking} />
            </div>
        </>
    );
}
