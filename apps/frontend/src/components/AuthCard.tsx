import React from "react";

interface AuthCardProps {
    title: string;
    children: React.ReactNode;
}

/**
 * AuthCard component renders a styled card with a title and children content.
 *
 * @param {AuthCardProps} props - The properties for the AuthCard component.
 * @param {string} props.title - The title to be displayed at the top of the card.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 *
 * @returns {JSX.Element} The rendered AuthCard component.
 */
export default function AuthCard({ title, children }: AuthCardProps) {
    return (
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md backdrop-blur-md border border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                {title}
            </h2>
            {children}
        </div>
    );
}
