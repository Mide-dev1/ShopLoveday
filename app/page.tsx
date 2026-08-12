import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterTabs from "@/components/FilterTabs";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <Hero />
      <FilterTabs />

      <section id="shop" className="px-8 pb-16 md:px-16">
        {/* grid-cols scales from 2 columns on mobile up to 4 on large screens */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
