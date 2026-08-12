import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/data/products";

// searchParams is how a Next.js page reads query-string values —
// visiting /search?q=bag gives us searchParams.q === "bag".
export default function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q ?? "";
    const results = searchProducts(query);

    return (
        <main className="min-h-screen bg-paper pb-20">
            <Navbar />
            <section className="px-6 py-8 md:px-16">
                <h1 className="font-display text-3xl text-ink">
                    {query ? `Results for "${query}"` : "Search"}
                </h1>
                <p className="mt-2 font-body text-sm text-muted">
                    {results.length} {results.length === 1 ? "item" : "items"} found
                </p>

                {results.length === 0 ? (
                    <p className="mt-12 font-body text-muted">
                        Nothing matched that search — try a different word, like a category
                        name (tops, shorts, bags, accessories).
                    </p>
                ) : (
                    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
                        {results.map((product) => (
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
