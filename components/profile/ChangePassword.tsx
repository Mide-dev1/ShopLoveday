"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function ChangePassword({ email }: { email: string }) {
    const { changePassword } = useAuth();
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Checked client-side first — no need to hit the server for a typo.
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation don't match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        setSubmitting(true);
        const result = await changePassword(email, oldPassword, newPassword);
        setSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="mt-4 w-full rounded-full border border-line py-3 font-body text-sm uppercase tracking-wide text-ink transition-colors hover:bg-line"
            >
                Change password
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 rounded-2xl border border-line p-5">
            <input
                required
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <input
                required
                type="password"
                placeholder="New password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />
            <input
                required
                type="password"
                placeholder="Confirm new password"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
            />

            {error && <p className="font-body text-xs text-ink">{error}</p>}
            {success && <p className="font-body text-xs text-ink">Password updated successfully.</p>}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-ink py-3 font-body text-sm font-medium uppercase tracking-wide text-paper disabled:opacity-50"
                >
                    {submitting ? "Updating..." : "Update password"}
                </button>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-line py-3 font-body text-sm uppercase tracking-wide text-ink"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
