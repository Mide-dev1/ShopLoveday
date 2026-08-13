import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

// Unlike the browser client, this one needs to read/write cookies through
// Next.js's request/response objects rather than document.cookie — that's
// why it takes `request` and `response` as arguments instead of being a
// single shared instance like lib/supabase.ts.
export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );
}
