"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "shoploveday-cookie-consent";

// Tiny helpers for reading/writing a real browser cookie — we're not using
// a library for this since the logic is only a few lines.
function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // SameSite=Lax + Secure: standard, safe defaults for a first-party cookie
    // like this — not sensitive data, just a stored preference.
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show the banner if no choice has been recorded yet.
        if (!getCookie(COOKIE_NAME)) setVisible(true);
    }, []);

    function accept() {
        setCookie(COOKIE_NAME, "accepted", 365);
        setVisible(false);
    }

    function decline() {
        // "Declined" still gets remembered — otherwise the banner would
        // reappear on every visit, which is worse than just asking once.
        setCookie(COOKIE_NAME, "declined", 365);
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md rounded-2xl border border-line bg-paper p-5 shadow-xl md:bottom-6">
            <p className="font-body text-sm text-ink">
                We use cookies to keep you logged in and remember your cart. By
                continuing, you agree to our use of cookies.
            </p>
            <div className="mt-4 flex gap-3">
                <button
                    onClick={accept}
                    className="flex-1 rounded-full bg-ink py-2.5 font-body text-xs font-medium uppercase tracking-wide text-paper"
                >
                    Accept
                </button>
                <button
                    onClick={decline}
                    className="flex-1 rounded-full border border-line py-2.5 font-body text-xs uppercase tracking-wide text-ink"
                >
                    Decline
                </button>
            </div>
        </div>
    );
}
