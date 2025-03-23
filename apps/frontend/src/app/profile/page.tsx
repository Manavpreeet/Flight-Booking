"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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

            const response = await api.get(`/auth/profile?email=${user.email}`);
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
        const { name, value, files } = e.target;

        if (name === "profile_picture" && files?.[0]) {
            const imageUrl = URL.createObjectURL(files[0]);
            setFormData((prev) => ({ ...prev, profile_picture: imageUrl }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            validateInput(name, value);
        }
    };

    const validateInput = (name: string, value: string) => {
        let error = "";

        if (name === "card_number" && !/^\d{16}$/.test(value)) {
            error = "Card number must be 16 digits.";
        }

        if (name === "expiry_date") {
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                error = "Expiry date must be in MM/YY format.";
            } else {
                const [month, year] = value.split("/").map(Number);
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;

                if (
                    year < currentYear ||
                    (year === currentYear && month < currentMonth)
                ) {
                    error = "Expiry date must be in the future.";
                }
            }
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (errors.card_number || errors.expiry_date) {
            toast.error("Please correct errors before submitting.");
            return;
        }

        setSubmitting(true);

        try {
            await api.patch(`/auth/profile?user_id=${user?.id}`, formData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-gray-50 py-14 px-4 sm:px-6"
        >
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 text-gray-600 hover:text-black flex items-center"
            >
                <FiArrowLeft className="mr-1" />
                Back
            </button>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 relative">
                {/* Back Button */}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        Edit Profile
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-sky-600 hover:text-sky-700 border border-sky-200 rounded px-3 py-1 transition shadow-sm"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 text-gray-700"
                >
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                            disabled={!isEditing}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label>Profile Picture</label>
                        <input
                            type="file"
                            name="profile_picture"
                            accept="image/*"
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                            disabled={!isEditing}
                        />
                        {formData.profile_picture && (
                            <img
                                src={formData.profile_picture}
                                alt="Profile Preview"
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                            />
                        )}
                    </div>

                    {/* Payment Info */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Payment Details
                    </h3>

                    <div>
                        <label>Card Number</label>
                        <input
                            type="text"
                            name="card_number"
                            value={formData.card_number}
                            onChange={handleChange}
                            maxLength={16}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400
                                ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}
                                ${errors.card_number ? "border-red-500" : ""}`}
                            disabled={!isEditing}
                        />
                        {errors.card_number && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.card_number}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400
                                    ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}
                                ${errors.expiry_date ? "border-red-500" : ""}`}
                            disabled={!isEditing}
                        />
                        {errors.expiry_date && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.expiry_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>UPI ID</label>
                        <input
                            type="text"
                            name="upi_id"
                            value={formData.upi_id}
                            onChange={handleChange}
                            placeholder="yourupi@bank"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-sky-400  ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                            disabled={!isEditing}
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        disabled={submitting || !isEditing}
                        className={`w-full flex items-center justify-center gap-2   font-medium py-3 rounded transition
                            ${isEditing ? "focus:ring-2 focus:ring-sky-400 bg-sky-600 hover:bg-sky-700 text-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}
                            ${
                                submitting
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                            }`}
                    >
                        {submitting ? (
                            <svg
                                className="animate-spin h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
                            "Update Profile"
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
