"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AddressManager from "./AddressManager";
import ChangePassword from "./ChangePassword";

export default function ProfileTab({
    userId,
    email,
    fullName,
    username,
    phone,
    onUpdateAuth,
    onSignOut,
}: {
    userId: string;
    email: string;
    fullName: string;
    username: string;
    phone: string;
    onUpdateAuth: (data: { full_name?: string; phone?: string; username?: string }) => Promise<{ error: string | null }>;
    onSignOut: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(fullName);
    const [usernameInput, setUsernameInput] = useState(username);
    const [phoneInput, setPhoneInput] = useState(phone);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // The `profiles` table is the source of truth (it's what enforces
        // username uniqueness), so we update it first. If that succeeds, we
        // also update the auth metadata copy so both stay in sync.
        const { error: dbError } = await supabase
            .from("profiles")
            .update({ full_name: nameInput, username: usernameInput, phone: phoneInput })
            .eq("id", userId);

        if (dbError) {
            setSaving(false);
            // Postgres error code 23505 = unique constraint violation
            setError(dbError.code === "23505" ? "That username is already taken." : dbError.message);
            return;
        }

        await onUpdateAuth({ full_name: nameInput, username: usernameInput, phone: phoneInput });
        setSaving(false);
        setEditing(false);
    }

    return (
        <div>
            {/* Account details — read view or edit form */}
            <div className="rounded-2xl border border-line p-6">
                {editing ? (
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                        <div>
                            <label className="font-mono text-xs uppercase text-muted">Full name</label>
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="mt-1 w-full rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-mono text-xs uppercase text-muted">Username</label>
                            <input
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/\s/g, ""))}
                                className="mt-1 w-full rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none"
                            />
                        </div>
                        <div>
                            <label className="font-mono text-xs uppercase text-muted">Phone number</label>
                            <input
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                className="mt-1 w-full rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none"
                            />
                        </div>

                        {error && <p className="font-body text-xs text-ink">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 rounded-full bg-ink py-3 font-body text-sm font-medium uppercase tracking-wide text-paper disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="flex-1 rounded-full border border-line py-3 font-body text-sm uppercase tracking-wide text-ink"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-body text-ink">{fullName || "No name set"}</p>
                            <p className="mt-1 font-body text-sm text-muted">@{username || "no-username"}</p>
                            <p className="mt-1 font-body text-sm text-muted">{email}</p>
                            <p className="mt-1 font-body text-sm text-muted">{phone || "No phone number set"}</p>
                        </div>
                        <button onClick={() => setEditing(true)} className="font-body text-xs text-ink underline">
                            Edit
                        </button>
                    </div>
                )}
            </div>

            <ChangePassword email={email} />

            {/* Saved addresses */}
            <div className="mt-10">
                <h2 className="font-body text-sm uppercase tracking-wide text-muted">Saved addresses</h2>
                <div className="mt-4">
                    <AddressManager userId={userId} />
                </div>
            </div>

            <Link
                href="/wishlist"
                className="mt-10 flex items-center justify-between rounded-2xl border border-line p-6 font-body text-sm text-ink transition-colors hover:bg-line"
            >
                View your wishlist
                <span aria-hidden="true">→</span>
            </Link>

            <button
                onClick={onSignOut}
                className="mt-4 w-full rounded-full border border-line py-4 font-body text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-line"
            >
                Sign out
            </button>
        </div>
    );
}
