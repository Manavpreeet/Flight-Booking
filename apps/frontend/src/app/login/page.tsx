"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "@/components/AuthCard";
import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaPhone,
    FaVenusMars,
} from "react-icons/fa";
import { AuthInput } from "@/components/AuthInput";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn } = useAuth();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            setIsSuccess(true);

            const pending = localStorage.getItem("pending_booking_data");
            if (pending) {
                router.push("/booking"); // Auto resume booking
                return;
            }

            setTimeout(() => router.push("/"), 2000);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row">
            <motion.video
                src="/animated-bg.mp4"
                autoPlay
                loop
                muted
                className={`absolute top-0 right-0 w-full h-full object-cover transition-all duration-1000 ${isSuccess ? "scale-110" : "md:w-1/2"}`}
            />
            <AnimatePresence>
                {!isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center items-center w-full md:w-1/2 min-h-screen bg-sky-300 p-6 shadow-xl "
                    >
                        <AuthCard title="Welcome Back">
                            <form className="space-y-4" onSubmit={handleLogin}>
                                <AuthInput
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<FaEnvelope />}
                                />
                                <AuthInput
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    icon={<FaLock />}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl w-full shadow-lg transition-transform hover:scale-105"
                                >
                                    Login
                                </button>
                            </form>
                            <p className="text-center text-sm text-gray-400 mt-4">
                                New here?{" "}
                                <a
                                    href="/signup"
                                    className="text-blue-400 hover:text-blue-500 transition"
                                >
                                    Create an account
                                </a>
                            </p>
                        </AuthCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
