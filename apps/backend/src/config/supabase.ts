import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supbaseUrl = process.env.SUPABASE_URL!;
const subaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supbaseUrl || !subaseAnonKey) {
    throw new Error("Missing Supabase creds");
}

export const supabase = createClient(supbaseUrl, subaseAnonKey);
