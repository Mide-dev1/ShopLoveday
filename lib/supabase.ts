import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project settings (Project Settings > API).
// They're read from environment variables, not hardcoded, so the same code works
// in development and production without editing files — you just set different
// values in your .env.local (local) and in Vercel's dashboard (production).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// The "anon" key is safe to expose in frontend code (hence NEXT_PUBLIC_ prefix) —
// Supabase enforces real security separately via Row Level Security policies
// on the database side, not by hiding this key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
