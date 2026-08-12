"use client"; // needs useState (quantity) and useCart (add to cart) — both browser-only

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProductById } from "@/data/products";
import { useCart } from "@/lib/CartContext";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function ProductPage() {
  const params = useParams(); // reads the [id] segment from the URL
  const product = getProductById(params.id as string);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-paper pb-20 md:pb-0">
        <Navbar />
        <p className="px-8 py-16 font-body text-muted md:px-16">
          We couldn&apos;t find that product.
        </p>
      </main>
    );
  }

  function handleAddToCart() {
    // Call addItem once per unit of quantity selected —
    // simple, and reuses the "bump existing quantity" logic already in CartContext.
    for (let i = 0; i < quantity; i++) addItem(product!);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // revert the button label after 2s
  }

  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="grid gap-12 px-8 py-16 md:grid-cols-2 md:px-16">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">{product.name}</h1>
          <p className="mt-4 font-mono text-xl text-ink">{formatNaira(product.price)}</p>

          {/* Quantity stepper */}
          <div className="mt-8 flex items-center gap-4">
            <span className="font-body text-sm text-muted">Quantity</span>
            <div className="flex items-center rounded-full border border-line">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 font-body text-ink"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-sm">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 font-body text-ink"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 w-full rounded-full bg-ink py-4 font-body text-sm font-medium uppercase tracking-wide text-paper transition-transform hover:scale-[1.02]"
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </section>
    </main>
  );
}
