"use client";

import { motion } from "framer-motion";

// Matching ISB's actual pattern: there is no big statement hero. Just a
// small eyebrow line of text, then straight into the filter bar and grid.
export default function Hero() {
  return (
    <section className="relative px-6 pb-8 pt-2 md:px-16">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 font-mono text-xs uppercase tracking-[0.2em] text-muted"
      >
        New arrivals — modern Nigerian fashion, delivered nationwide
      </motion.p>
    </section>
  );
}
