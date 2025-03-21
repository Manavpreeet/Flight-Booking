"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        gender: "Other",
        profile_picture: "",
        card_number: "",
        expiry_date: "",
        upi_id: "",
    });

    const [errors, setErrors] = useState({
        card_number: "",
        expiry_date: "",
    });

    useEffect(() => {
        async function fetchUserProfile() {
            if (!user) return router.push("/signup");

            const response = await api.get(`/auth/profile?user_id=${user.id}`);
            const userData = response.data.user;

            setFormData({
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                phone: userData.phone || "",
                gender: userData.gender || "Other",
                profile_picture: userData.profile_picture || "",
                card_number: userData.card_number || "",
                expiry_date: userData.expiry_date || "",
                upi_id: userData.upi_id || "",
            });
        }
        fetchUserProfile();
    }, [user, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validateInput(e.target.name, e.target.value);
    };

    const validateInput = (name: string, value: string) => {
        let errorMessage = "";

        if (name === "card_number") {
            if (!/^\d{16}$/.test(value)) {
                errorMessage = "Card number must be 16 digits.";
            }
        }

        if (name === "expiry_date") {
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                errorMessage = "Expiry date must be in MM/YY format.";
            } else {
                const [month, year] = value.split("/").map(Number);
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;

                if (
                    year < currentYear ||
                    (year === currentYear && month < currentMonth)
                ) {
                    errorMessage = "Expiry date must be in the future.";
                }
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (errors.card_number || errors.expiry_date) {
            alert("Please correct the errors before submitting.");
            return;
        }

        try {
            await api.patch(`/auth/profile?user_id${user?.id}`, formData);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                    Edit Profile
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 text-gray-500"
                >
                    {/* Profile Info Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 font-medium">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                        <label className="block text-gray-600 font-medium">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                        />
                        {formData.profile_picture && (
                            <img
                                src={formData.profile_picture}
                                alt="Profile"
                                className="w-24 h-24 mt-2 rounded-full border shadow-md"
                            />
                        )}
                    </div>

                    {/* Payment Section */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Payment Details
                    </h3>

                    <div>
                        <label className="block text-gray-600 font-medium">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="card_number"
                            value={formData.card_number}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 ${errors.card_number ? "border-red-500" : ""}`}
                            maxLength={16}
                            placeholder="1234 5678 9012 3456"
                        />
                        {errors.card_number && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.card_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium">
                            Expiry Date
                        </label>
                        <input
                            type="text"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 ${errors.expiry_date ? "border-red-500" : ""}`}
                            placeholder="MM/YY"
                        />
                        {errors.expiry_date && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.expiry_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-600 font-medium">
                            UPI ID
                        </label>
                        <input
                            type="text"
                            name="upi_id"
                            value={formData.upi_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            placeholder="yourupi@bank"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition w-full"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}
