"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiHelpCircle, FiMenu, FiX } from "react-icons/fi";
import { FaPlaneDeparture } from "react-icons/fa";

export default function Navbar() {
    const { user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    console.log("NavBar", user);
    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white shadow-sm px-6 py-4 flex justify-between items-center"
        >
            {/* Logo */}
            <Link
                href="/"
                className="text-2xl font-semibold text-sky-600 tracking-tight"
            >
                Orbitica
            </Link>

            {/* Desktop Links */}
            <div
                className="hidden md:flex items-center gap-6 relative"
                ref={dropdownRef}
            >
                <Link
                    href="/help"
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                >
                    <FiHelpCircle size={18} />
                    Help
                </Link>
                <Link
                    href="/my-bookings"
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
                >
                    <FaPlaneDeparture size={18} />
                    My Bookings
                </Link>

                {loading ? (
                    <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
                ) : !user ? (
                    <>
                        <Link
                            href="/signup"
                            className="px-4 py-2 border rounded-full text-sm text-gray-800 hover:bg-gray-100 transition"
                        >
                            Sign Up
                        </Link>
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-black text-white text-sm rounded-full hover:opacity-90 transition"
                        >
                            Log In
                        </Link>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        >
                            {user?.profile_picture ||
                            user?.user?.profile_picture ? (
                                <img
                                    src={
                                        user?.profile_picture ||
                                        user?.user?.profile_picture
                                    }
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <span className="text-sm text-gray-800">
                                    {user?.user?.email
                                        ? user.user.email[0].toUpperCase()
                                        : user?.email
                                          ? user.email[0].toUpperCase()
                                          : "U"}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-14 bg-white border shadow-md rounded-md w-48 z-50"
                                >
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={signOut}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-sky-600"
                onClick={() => setMenuOpen(true)}
            >
                <FiMenu size={24} />
            </button>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-white z-50 flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold text-sky-600">
                                Orbitica
                            </span>
                            <button
                                className="text-sky-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FiX size={28} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/help"
                                className="text-gray-700 text-base"
                                onClick={() => setMenuOpen(false)}
                            >
                                Help
                            </Link>
                            <Link
                                href="/my-bookings"
                                className="text-gray-700 text-base"
                                onClick={() => setMenuOpen(false)}
                            >
                                My Bookings
                            </Link>

                            {loading ? (
                                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
                            ) : !user ? (
                                <>
                                    <Link
                                        href="/signup"
                                        className="px-4 py-2 border rounded-full text-sm text-gray-800 hover:bg-gray-100 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 bg-black text-white text-sm rounded-full hover:opacity-90 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Log In
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/profile"
                                        className="text-sm text-gray-700 hover:bg-gray-100 py-2"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setMenuOpen(false);
                                        }}
                                        className="text-left text-red-500 py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
