import Link from "next/link";
import Navbar from "@/components/Navbar";

const categories = ["Tops", "Shorts", "Bags", "Accessories"];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="px-6 py-8 md:px-16">
        <h1 className="font-display text-3xl text-ink">Categories</h1>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-line font-body text-sm uppercase tracking-wide text-ink transition-colors hover:bg-line"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
