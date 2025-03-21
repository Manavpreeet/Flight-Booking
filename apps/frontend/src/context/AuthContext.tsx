"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { User, AuthContextProps } from "@/types/auth";
import { api } from "@/lib/api";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Initialize state from localStorage
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    useEffect(() => {
        // Ensure user is kept in sync with localStorage
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const signUp = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        gender: string
    ) => {
        const { data, status } = await api.post(`/auth`, {
            email,
            password,
            firstName,
            lastName,
            phone,
            gender,
        });

        if (status !== 200 || !data?.user) throw new Error("Failed to sign up");

        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const signIn = async (email: string, password: string) => {
        const { data, status } = await api.post(`/auth`, { email, password });

        if (status !== 200 || !data?.user) throw new Error("Failed to sign in");

        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const signOut = async () => {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
