/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Scan src folder for Tailwind classes
        "./pages/**/*.{js,ts,jsx,tsx}", // Include Next.js pages directory
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
