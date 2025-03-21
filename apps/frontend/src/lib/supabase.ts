import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ytjwfsvqxlgwnzmvukpf.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0andmc3ZxeGxnd256bXZ1a3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzYwOTIsImV4cCI6MjA1NzgxMjA5Mn0.nOAyM-iL65PRCUbC_9uxhrJErFopcwcflM5D1-nq4jQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
