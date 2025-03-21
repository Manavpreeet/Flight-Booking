export interface User {
    id: string;
    email: string;
}

export interface AuthContextProps {
    user: User | null;
    signUp: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        gender: string
    ) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export interface AuthInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    error?: string | undefined;
}
