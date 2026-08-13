import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/server";

// Middleware runs on the server, before any page renders. This is what
// makes cookie-based auth "professional" rather than just a storage swap:
// it means a logged-in check can happen before the browser even gets the
// page, instead of the page loading first and then figuring out who's
// logged in client-side (which is what localStorage-based auth forces you
// into, and it flashes a "logged out" state for a moment on every load).
// Routes listed here require a logged-in session with NO public fallback —
// unlike /profile (which intentionally shows a sign-in screen to logged-out
// visitors), anyone hitting these without a session gets redirected before
// the page ever renders. Add future auth-only routes here — e.g. once
// checkout exists, "/checkout" belongs in this list.
const PROTECTED_ROUTES = ["/checkout"];

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request });
    const supabase = createMiddlewareClient(request, response);

    // Calling getUser() here (not just getSession()) forces a check against
    // Supabase's server, which is what actually refreshes an expiring token —
    // this is the "keeps sessions fresh" part. Skipping this call is the most
    // common reason cookie-based Supabase auth silently breaks in production.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isProtected = PROTECTED_ROUTES.some((path) => request.nextUrl.pathname.startsWith(path));

    if (isProtected && !user) {
        // Redirect to /profile (which shows the sign-in screen) rather than a
        // dead end — and remember where they were headed, so we can send them
        // straight back there after they log in.
        const redirectUrl = new URL("/profile", request.url);
        redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

// Only run this on normal page requests — skip static files, images, and
// Next.js internals, since checking auth on every single asset request
// would be wasted work.
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
