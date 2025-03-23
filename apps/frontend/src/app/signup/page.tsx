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
import toast from "react-hot-toast";
export default function SignUpPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { signUp } = useAuth();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First Name is required";
        if (!lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!phone.match(/^\d{10}$/))
            newErrors.phone = "Enter a valid 10-digit phone number";
        if (!email.match(/^\S+@\S+\.\S+$/))
            newErrors.email = "Enter a valid email address";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        setLoading(true);

        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await signUp(email, password, firstName, lastName, phone, gender);
            setLoading(false);
            toast.success(
                "Account created successfully. Please confirm your email address"
            );
            setIsSuccess(true);
            const pending = localStorage.getItem("pending_booking_data");
            if (pending) {
                router.push("/booking"); // Auto resume booking
                return;
            }
            setTimeout(() => router.push("/"), 2000);
        } catch (error) {
            toast.error("Error while singing up");
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col bg-sky-300 md:flex-row">
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
                        <AuthCard title="Create an Account">
                            <form
                                className="space-y-4 "
                                onSubmit={handleSignUp}
                            >
                                <AuthInput
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    icon={<FaUser />}
                                    error={errors.firstName}
                                />
                                <AuthInput
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    icon={<FaUser />}
                                    error={errors.lastName}
                                />
                                <AuthInput
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    icon={<FaPhone />}
                                    error={errors.phone}
                                />

                                <AuthInput
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<FaEnvelope />}
                                    error={errors.email}
                                />
                                <AuthInput
                                    type="text"
                                    placeholder="Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    icon={<FaVenusMars />}
                                />
                                <AuthInput
                                    type="password"
                                    placeholder="Create a password"
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
                                    Sign Up
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-400 mt-4">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-400 hover:text-blue-500 transition"
                                >
                                    Login
                                </a>
                            </p>
                        </AuthCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
