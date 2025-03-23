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
import { supabase } from "@/lib/supabase";

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

    const [session, setSession] = useState<string | null>(() => {
        // Initialize state from localStorage
        if (typeof window !== "undefined") {
            const storedSession = localStorage.getItem("session");
            return storedSession ? JSON.parse(storedSession) : null;
        }
        return null;
    });

    const [token, setToken] = useState<string | null>(() => {
        // Initialize state from localStorage
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            return storedToken ? storedToken : null;
        }
        return null;
    });

    useEffect(() => {
        // Ensure user is kept in sync with localStorage
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem("user");
            const storedSession = localStorage.getItem("session");
            const storedToken = localStorage.getItem("token");

            setUser(storedUser ? JSON.parse(storedUser) : null);
            setSession(storedSession ? JSON.parse(storedSession) : null);
            setToken(storedToken ? storedToken : null);
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

        if (status !== 201 || !data?.user) throw new Error("Failed to sign up");

        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const signIn = async (email: string, password: string) => {
        const { data, status } = await api.post(`/auth`, { email, password });
        if (status !== 200 || !data?.user) throw new Error("Failed to sign in");

        localStorage.setItem("token", data.session?.access_token);
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const signOut = async () => {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };
    const loginWithToken = async (token: string) => {
        localStorage.setItem("token", token);

        let session = await supabase.auth.getSession();

        if (session.error) {
            console.error("Failed to sign in with token:", token);
            window.location.href = "/login";
        }

        localStorage.setItem(
            "supabaseUser",
            JSON.stringify(session.data.session?.user)
        );
        localStorage.setItem("session", JSON.stringify(session.data.session));
        const { data, status } = await api.get(
            `/auth/profile?email=${session.data.session?.user.email}`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (status !== 200 || !data?.user) {
            console.error("Failed to sign in with token:", token);
            throw new Error("Failed to sign in");
        }

        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signUp,
                signIn,
                signOut,
                session,
                token,
                loginWithToken,
            }}
        >
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
