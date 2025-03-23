import { User } from "@supabase/supabase-js";

declare global {
    namespace Express {
        interface Request {
            user?: User extends { id: string }
                ? User & { token: string }
                : null;
        }
    }
}
