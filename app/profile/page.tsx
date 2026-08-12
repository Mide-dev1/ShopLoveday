"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";

export default function ProfilePage() {
  const { user, loading, signUp, signIn, signOut } = useAuth();

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
        {user ? <LoggedInView email={user.email!} onSignOut={signOut} /> : <AuthForm signUp={signUp} signIn={signIn} />}
      </section>
    </main>
  );
}

// Shown once someone is logged in — account summary + the order-tracking shell.
function LoggedInView({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-ink">My account</h1>
      <p className="mt-1 font-body text-sm text-muted">{email}</p>

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

      <button
        onClick={onSignOut}
        className="mt-10 w-full rounded-full border border-line py-4 font-body text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-line"
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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result =
      mode === "signup" ? await signUp(email, password, fullName) : await signIn(email, password);

    setSubmitting(false);
    if (result.error) setError(result.error);
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
