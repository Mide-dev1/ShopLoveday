"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContextType = {
    user: User | null;
    loading: boolean; // true while we're still checking if a session exists
    signUp: (
        email: string,
        password: string,
        fullName: string
    ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    updateProfile: (data: { full_name?: string; phone?: string }) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On load, ask Supabase if there's already a valid session
        // (e.g. the person logged in yesterday and closed the tab).
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // Subscribe to auth changes — this fires automatically whenever
        // someone logs in, logs out, or their session refreshes, so `user`
        // always reflects the current truth without us polling manually.
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Cleanup: stop listening when this provider unmounts (e.g. hot reload in dev).
        return () => listener.subscription.unsubscribe();
    }, []);

    async function signUp(email: string, password: string, fullName: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }, // stored on the user record
                // window.location.origin is whatever domain the person is actually
                // on right now — localhost while you're testing, your real Vercel
                // domain once deployed. This is what was defaulting to localhost
                // before: without setting this explicitly, Supabase falls back to
                // whatever "Site URL" is configured in its dashboard.
                emailRedirectTo: `${window.location.origin}/profile`,
            },
        });
        // If email confirmation is required, Supabase creates the user but does
        // NOT return a session yet — that's how we know to show "check your email"
        // instead of treating the signup as instantly complete.
        const needsConfirmation = !error && !data.session;
        return { error: error?.message ?? null, needsConfirmation };
    }

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    // Updates fields stored in the user's metadata (name, phone) — separate
    // from email/password, which Supabase handles through different methods
    // that involve re-verification.
    async function updateProfile(data: { full_name?: string; phone?: string }) {
        const { error } = await supabase.auth.updateUser({ data });
        return { error: error?.message ?? null };
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
    return ctx;
}
