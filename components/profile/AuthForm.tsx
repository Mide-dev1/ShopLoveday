"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AuthForm() {
    const { signUp, verifySignupCode, resendSignupCode, signIn } = useAuth();

    // "landing" = welcome screen, "login"/"signup" = the form, "verify" = OTP code entry
    const [mode, setMode] = useState<"landing" | "login" | "signup" | "verify">("landing");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (mode === "signup") {
            const result = await signUp({ email, password, fullName, username, phone });
            setSubmitting(false);
            if (result.error) setError(result.error);
            else setMode("verify"); // move to code entry — signUp never logs in directly anymore
        } else {
            const result = await signIn(email, password);
            setSubmitting(false);
            if (result.error) setError(result.error);
            // on success, useAuth's onAuthStateChange flips the page to the dashboard automatically
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const result = await verifySignupCode(email, code);
        setSubmitting(false);
        if (result.error) setError(result.error);
        // on success, onAuthStateChange fires and the page switches to the dashboard
    }

    async function handleResend() {
        setResendMessage(null);
        const result = await resendSignupCode(email);
        setResendMessage(result.error ? result.error : "New code sent.");
    }

    // ---- Landing screen ----
    if (mode === "landing") {
        return (
            <div className="mx-auto flex max-w-sm flex-col items-center py-12 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-line">
                    <User size={40} className="text-muted" />
                </div>
                <h1 className="mt-6 font-display text-3xl text-ink">Welcome to ShopLoveday</h1>
                <p className="mt-3 font-body text-sm text-muted">
                    Sign in to access your account, track orders, and save your favorites
                </p>
                <div className="mt-8 flex w-full gap-3">
                    <button
                        onClick={() => setMode("login")}
                        className="flex-1 rounded-full bg-ink py-3 font-body text-sm font-medium uppercase tracking-wide text-paper transition-transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className="flex-1 rounded-full border border-line py-3 font-body text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-line"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        );
    }

    // ---- OTP code entry screen ----
    if (mode === "verify") {
        return (
            <div className="mx-auto max-w-sm text-center">
                <h1 className="font-display text-3xl text-ink">Enter your code</h1>
                <p className="mt-3 font-body text-sm text-muted">
                    We sent a 6-digit code to <span className="text-ink">{email}</span>
                </p>

                <form onSubmit={handleVerify} className="mt-8 flex flex-col gap-4">
                    <input
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        className="rounded-full border border-line px-5 py-3 text-center font-mono text-lg tracking-[0.3em] text-ink outline-none placeholder:text-muted"
                    />

                    {error && <p className="font-body text-xs text-ink">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting || code.length !== 6}
                        className="rounded-full bg-ink py-4 font-body text-sm font-medium uppercase tracking-wide text-paper transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {submitting ? "Verifying..." : "Verify & continue"}
                    </button>
                </form>

                <button onClick={handleResend} className="mt-6 font-body text-sm text-muted underline">
                    Didn&apos;t get a code? Resend
                </button>
                {resendMessage && <p className="mt-2 font-body text-xs text-muted">{resendMessage}</p>}
            </div>
        );
    }

    // ---- Login / Signup form ----
    return (
        <div className="mx-auto max-w-sm">
            <button onClick={() => setMode("landing")} className="mb-6 font-body text-sm text-muted underline">
                ← Back
            </button>

            <h1 className="font-display text-3xl text-ink">
                {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 font-body text-sm text-muted">
                {mode === "login" ? "Log in to track your orders." : "A few details to get you set up."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                {mode === "signup" && (
                    <>
                        <input
                            required
                            type="text"
                            placeholder="Full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                        />
                        <input
                            required
                            type="text"
                            placeholder="Username (shown on your account instead of your name)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                            className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                        />
                    </>
                )}
                <input
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                />
                {mode === "signup" && (
                    <input
                        required
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                    />
                )}
                <input
                    required
                    type="password"
                    placeholder="Password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
                />

                {error && <p className="font-body text-xs text-ink">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 rounded-full bg-ink py-4 font-body text-sm font-medium uppercase tracking-wide text-paper transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                    {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
                </button>
            </form>

            <button
                onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError(null);
                }}
                className="mt-6 font-body text-sm text-muted underline"
            >
                {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
            </button>
        </div>
    );
}
