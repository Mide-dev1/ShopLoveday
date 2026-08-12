import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="px-6 py-8 md:px-16">
        <h1 className="font-display text-3xl text-ink">Profile</h1>
        {/* Placeholder — becomes a real login/account page once Supabase auth is added. */}
        <p className="mt-4 font-body text-muted">
          Sign in to track orders and manage your account. Coming soon.
        </p>
      </section>
    </main>
  );
}
