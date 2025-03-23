import { AuthInputProps } from "@/types/auth";

/**
 * AuthInput component renders an input field with an icon.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.type - The type of the input field (e.g., "text", "password").
 * @param {string} props.placeholder - The placeholder text for the input field.
 * @param {string} props.value - The current value of the input field.
 * @param {function} props.onChange - The function to call when the input value changes.
 * @param {string} props.error - The current error of the input field.
 * @param {React.ReactNode} props.icon - The icon to display inside the input field.
 *
 * @returns {JSX.Element} The rendered AuthInput component.
 */
export function AuthInput({
    type,
    placeholder,
    value,
    onChange,
    icon,
    error = undefined,
}: AuthInputProps) {
    return (
        <div className="relative w-full">
            <span className="absolute left-4 top-3 text-gray-500">{icon}</span>
            <input
                type={type}
                placeholder={placeholder}
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-xl w-full p-3 pl-12 text-gray-700  transition focus:scale-105"
                value={value}
                onChange={onChange}
                required
            />
            {error && (
                <p className="text-red-500 text-xs absolute pb-4">{error}</p>
            )}
        </div>
    );
}
