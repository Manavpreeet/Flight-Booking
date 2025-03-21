"use client";
import { AuthProvider } from "@/context/AuthContext";
import { FlightProvider } from "@/context/FlightContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedSession = localStorage.getItem("session");
        const storedUser = localStorage.getItem("user");
        if (!storedSession || !storedUser) {
            localStorage.clear();
            if (pathname !== "/signup" && pathname !== "/login") {
                router.push("/signup");
            }
        } else {
            // If the user is logged in and tries to visit login/signup, redirect to home
            if (pathname === "/signup" || pathname === "/login") {
                console.log("Pushing");
                router.push("/");
            }
        }
    }, [pathname]);

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <FlightProvider>{children}</FlightProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
