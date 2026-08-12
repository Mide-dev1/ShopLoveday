"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";

export default function ProfilePage() {
  const { user, loading, signUp, signIn, signOut, updateProfile } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <Navbar />
        <p className="px-6 py-8 font-body text-muted md:px-16">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navbar />
      <section className="px-6 py-8 md:px-16">
        {user ? (
          <LoggedInView
            email={user.email!}
            fullName={user.user_metadata?.full_name ?? ""}
            phone={user.user_metadata?.phone ?? ""}
            onSignOut={signOut}
            onUpdate={updateProfile}
          />
        ) : (
          <AuthForm signUp={signUp} signIn={signIn} />
        )}
      </section>
    </main>
  );
}

// Shown once someone is logged in — account summary + the order-tracking shell.
function LoggedInView({
  email,
  fullName,
  phone,
  onSignOut,
  onUpdate,
}: {
  email: string;
  fullName: string;
  phone: string;
  onSignOut: () => void;
  onUpdate: (data: { full_name?: string; phone?: string }) => Promise<{ error: string | null }>;
}) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(fullName);
  const [phoneInput, setPhoneInput] = useState(phone);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await onUpdate({ full_name: nameInput, phone: phoneInput });
    setSaving(false);
    if (result.error) setError(result.error);
    else setEditing(false);
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-ink">My account</h1>

      {/* Account details — read view or edit form, toggled by `editing` */}
      <div className="mt-6 rounded-2xl border border-line p-6">
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
              <label className="font-mono text-xs uppercase text-muted">Phone number</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="080..."
                className="mt-1 w-full rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
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
              <p className="mt-1 font-body text-sm text-muted">{email}</p>
              <p className="mt-1 font-body text-sm text-muted">{phone || "No phone number set"}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="font-body text-xs text-ink underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Order tracking — empty state for now. Once checkout exists, this
          section pulls real orders from the database and shows each one's
          current status (Processing / Shipped / Out for delivery / Delivered). */}
      <div className="mt-10">
        <h2 className="font-body text-sm uppercase tracking-wide text-muted">Your orders</h2>
        <div className="mt-4 rounded-2xl border border-line p-6 text-center">
          <p className="font-body text-sm text-muted">
            You haven&apos;t placed any orders yet. Once you check out, you&apos;ll be
            able to track delivery progress right here.
          </p>
        </div>
      </div>

      {/* Saved addresses — same idea, empty shell for now. */}
      <div className="mt-10">
        <h2 className="font-body text-sm uppercase tracking-wide text-muted">
          Saved addresses
        </h2>
        <div className="mt-4 rounded-2xl border border-line p-6 text-center">
          <p className="font-body text-sm text-muted">
            No saved addresses yet. Add one at checkout to speed up next time.
          </p>
        </div>
      </div>

      {/* Quick link to the wishlist, so account-related pages feel connected */}
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

// Shown when logged out — one form that toggles between Sign up and Log in,
// rather than two separate pages, to keep the flow short.
function AuthForm({
  signUp,
  signIn,
}: {
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Set once signup succeeds but Supabase is waiting on email confirmation —
  // swaps the form out for a "check your email" message instead.
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "signup") {
      const result = await signUp(email, password, fullName);
      setSubmitting(false);
      if (result.error) setError(result.error);
      else if (result.needsConfirmation) setConfirmationSentTo(email);
      // if neither, Supabase auto-confirmed and onAuthStateChange will flip us to LoggedInView
    } else {
      const result = await signIn(email, password);
      setSubmitting(false);
      if (result.error) setError(result.error);
    }
  }

  // Confirmation-pending screen — replaces the form entirely once shown
  if (confirmationSentTo) {
    return (
      <div className="max-w-sm">
        <h1 className="font-display text-3xl text-ink">Check your email</h1>
        <p className="mt-4 font-body text-sm text-muted">
          A confirmation link has been sent to <span className="text-ink">{confirmationSentTo}</span>.
          Tap the link in that email to activate your account.
        </p>
        <button
          onClick={() => setConfirmationSentTo(null)}
          className="mt-6 font-body text-sm text-muted underline"
        >
          Back to sign up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      <h1 className="font-display text-3xl text-ink">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 font-body text-sm text-muted">
        {mode === "login"
          ? "Log in to track your orders."
          : "Sign up to track orders and save your details."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {mode === "signup" && (
          <input
            required
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border border-line px-5 py-3 font-body text-sm text-ink outline-none placeholder:text-muted"
        />
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
