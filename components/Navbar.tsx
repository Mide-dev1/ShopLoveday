"use client"; // useCart() reads live state, so this can't be server-rendered

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import MenuDrawer from "./MenuDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault(); // stop the browser's default full-page form reload
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    // A fragment, not a single wrapping element: the drawer and search panel
    // below are now siblings of <header>, not children of it. This matters
    // because <header> uses backdrop-blur (backdrop-filter), and any element
    // with backdrop-filter becomes the "containing box" for position:fixed
    // descendants — which was trapping our full-screen drawer inside the
    // navbar's own (small) height instead of covering the whole screen.
    <>
      <header className="sticky top-0 z-30 bg-paper/90 px-6 py-5 backdrop-blur-md md:px-16">
        <div className="grid grid-cols-3 items-center">
          {/* LEFT: menu button — opens the drawer below */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false); // don't let both panels be open at once
            }}
            className="w-fit rounded-full border border-line p-3 text-ink transition-colors hover:bg-line"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* CENTER: logo, in the middle grid column so it's always centered */}
          <Link
            href="/"
            className="justify-self-center font-display text-2xl tracking-tight text-ink"
          >
            Shop<span className="italic">Loveday</span>
          </Link>

          {/* RIGHT: search + cart */}
          <div className="flex items-center justify-self-end gap-3">
            <button
              aria-label={searchOpen ? "Close search" : "Search"}
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
              className="rounded-full border border-line p-3 text-ink transition-colors hover:bg-line"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            <Link
              href="/cart"
              aria-label="View cart"
              className="relative rounded-full bg-ink p-3 text-paper transition-transform hover:scale-105"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-paper text-[10px] font-medium text-ink ring-1 ring-ink">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search dropdown stays here — it's only meant to span the navbar
            width anyway, so being confined to header's box is fine for this one. */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full border-b border-line bg-paper px-6 py-4 md:px-16"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search size={18} className="text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tops, shorts, bags, accessories..."
                  className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-muted"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MenuDrawer now lives OUTSIDE the blurred header, as a sibling —
          so its position:fixed is relative to the real viewport again. */}
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
