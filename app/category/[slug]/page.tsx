import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/data/products";

// The folder name [slug] means Next.js passes whatever's in that
// part of the URL as `params.slug`. Visiting /category/tops
// gives us params.slug === "tops".
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const items = getProductsByCategory(params.slug);
  // Capitalize for display: "tops" -> "Tops"
  const title = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="px-8 py-16 md:px-16">
        <h1 className="font-display text-4xl text-ink">{title}</h1>
        <p className="mt-2 font-body text-sm text-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>

        {items.length === 0 ? (
          // Empty state: tell the visitor what happened and what to do next,
          // rather than just showing a blank page.
          <p className="mt-12 font-body text-muted">
            Nothing here yet — check back soon or browse another category.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {items.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
