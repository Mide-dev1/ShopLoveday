"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/types";

// Formats a number like 15000 into "₦15,000" — no decimals, comma-separated,
// matching how prices are actually shown in Nigerian retail.
function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      // whileHover only runs on interaction — cheap, and gives the grid
      // a bit of life without animating anything on page load.
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <p className="font-body text-sm text-ink">{product.name}</p>
          <p className="mt-1 font-mono text-xs text-muted">{product.category}</p>
        </div>
        <p className="font-mono text-sm text-ink">{formatNaira(product.price)}</p>
      </div>
    </motion.div>
  );
}
