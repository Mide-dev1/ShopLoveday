import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="px-6 py-8 md:px-16">
        <h1 className="font-display text-3xl text-ink">Wishlist</h1>
        {/* Placeholder for now — saved items will need user accounts,
            which we're building once Supabase auth is wired up. */}
        <p className="mt-4 font-body text-muted">
          Your saved items will show up here once you're logged in.
        </p>
        <Link href="/" className="mt-4 inline-block font-body text-sm text-ink underline">
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
