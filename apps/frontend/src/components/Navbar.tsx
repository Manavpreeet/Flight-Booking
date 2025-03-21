"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(JSON.parse(localStorage?.getItem("user")));
    }, []);
    const { signOut } = useAuth();

    return (
        <nav className="bg-white shadow-lg p-4 flex justify-between items-center px-8">
            <h1 className="text-2xl font-bold text-blue-600">
                ✈ Flight Booker
            </h1>
            {user && (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
                    >
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <span className="text-gray-800">{user.email}</span>
                        )}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 w-48">
                            <a
                                href="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Edit Profile
                            </a>
                            <button
                                onClick={signOut}
                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
