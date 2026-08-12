"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/CartContext";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />
      <section className="px-8 py-16 md:px-16">
        <h1 className="font-display text-4xl text-ink">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-12">
            <p className="font-body text-muted">Your cart is empty.</p>
            <Link href="/" className="mt-4 inline-block font-body text-sm text-ink underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 md:grid-cols-3">
            {/* Item list — takes up 2 of 3 columns on desktop */}
            <div className="md:col-span-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border-b border-line py-6"
                >
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-body text-sm text-ink">{product.name}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {formatNaira(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center rounded-full border border-line">
                    <button
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1.5 font-body text-ink"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-mono text-sm">{quantity}</span>
                    <button
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1.5 font-body text-ink"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="font-body text-xs text-muted underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary — sticky so it stays visible while scrolling a long cart */}
            <div className="h-fit rounded-2xl border border-line p-6 md:sticky md:top-8">
              <div className="flex justify-between font-body text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-mono text-ink">{formatNaira(totalPrice)}</span>
              </div>
              <p className="mt-2 font-body text-xs text-muted">
                Delivery calculated at checkout.
              </p>
              <button className="mt-6 w-full rounded-full bg-ink py-4 font-body text-sm font-medium uppercase tracking-wide text-paper transition-transform hover:scale-[1.02]">
                Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
