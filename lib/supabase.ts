"use client";

import { createBrowserClient } from "@supabase/ssr";

// This replaces the old createClient() from @supabase/supabase-js.
// createBrowserClient does the same job (talks to Supabase from the
// browser) but stores the session in cookies instead of localStorage —
// that's the entire change needed to move auth over to cookies, since
// every file that already imports `supabase` from here keeps working
// with no changes on their end.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
