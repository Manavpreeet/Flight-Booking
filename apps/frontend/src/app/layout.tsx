"use client";
import { AuthProvider } from "@/context/AuthContext";
import { FlightProvider } from "@/context/FlightContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense, useEffect } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // useEffect(() => {
    //     const storedSession = localStorage.getItem("session");
    //     const storedUser = localStorage.getItem("user");
    //     if (!storedSession || !storedUser) {
    //         localStorage.clear();
    //         if (pathname !== "/signup" && pathname !== "/login") {
    //             router.push("/signup");
    //         }
    //     } else {
    //         // If the user is logged in and tries to visit login/signup, redirect to home
    //         if (pathname === "/signup" || pathname === "/login") {
    //             console.log("Pushing");
    //             router.push("/");
    //         }
    //     }
    // }, [pathname]);

    return (
        <html lang="en">
            <body>
                <Suspense fallback={<div>Loading...</div>}>
                    <AuthProvider>
                        <Navbar />
                        <FlightProvider>{children}</FlightProvider>
                        <Toaster position="top-center" />
                    </AuthProvider>
                </Suspense>
            </body>
        </html>
    );
}
