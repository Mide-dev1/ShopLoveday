"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type SignUpFields = {
    email: string;
    password: string;
    fullName: string;
    username: string;
    phone: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean; // true while we're still checking if a session exists
    signUp: (fields: SignUpFields) => Promise<{ error: string | null }>;
    verifySignupCode: (email: string, code: string) => Promise<{ error: string | null }>;
    resendSignupCode: (email: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    updateProfile: (data: { full_name?: string; phone?: string; username?: string }) => Promise<{ error: string | null }>;
    changePassword: (email: string, oldPassword: string, newPassword: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // Creates the account but does NOT log the person in yet — Supabase sends
    // a 6-digit code to their email (once the email template is switched to
    // show {{ .Token }} instead of a link — see the setup instructions).
    // The account only becomes active after verifySignupCode succeeds below.
    async function signUp({ email, password, fullName, username, phone }: SignUpFields) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // This metadata is what the database trigger (handle_new_user in
                // schema.sql) reads to populate the profiles table automatically.
                data: { full_name: fullName, username, phone },
            },
        });
        return { error: error?.message ?? null };
    }

    // Verifies the 6-digit code the person typed against what Supabase sent.
    // On success this ALSO logs them in immediately — no separate login step.
    async function verifySignupCode(email: string, code: string) {
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: "signup",
        });
        return { error: error?.message ?? null };
    }

    // Triggers Supabase to send a fresh code — used by the "Resend code" link
    // if the first email is slow, lost, or the code expired.
    async function resendSignupCode(email: string) {
        const { error } = await supabase.auth.resend({ type: "signup", email });
        return { error: error?.message ?? null };
    }

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    // Updates auth metadata (kept in sync with the `profiles` table separately
    // — see updateProfile usage in the dashboard, which also writes to `profiles`).
    async function updateProfile(data: { full_name?: string; phone?: string; username?: string }) {
        const { error } = await supabase.auth.updateUser({ data });
        return { error: error?.message ?? null };
    }

    // Supabase's updateUser() will happily change the password without ever
    // checking the old one — it trusts that if you have a valid session,
    // that's enough. To actually REQUIRE the old password (as requested),
    // we manually verify it first by attempting a real sign-in with it.
    // If that fails, the old password was wrong and we stop there.
    async function changePassword(email: string, oldPassword: string, newPassword: string) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email,
            password: oldPassword,
        });
        if (verifyError) return { error: "Current password is incorrect." };

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error?.message ?? null };
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUp,
                verifySignupCode,
                resendSignupCode,
                signIn,
                signOut,
                updateProfile,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
    return ctx;
}
