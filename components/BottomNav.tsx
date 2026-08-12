"use client";

import Link from "next/link";
import { Home, Grid2x2, Heart, User } from "lucide-react";

// Cart lives in the top navbar (next to search), so this bar is purely
// navigation: Home, Categories, Wishlist, Profile.
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-line bg-paper py-3">
      <Link href="/" className="flex flex-col items-center gap-1 text-ink">
        <Home size={20} />
        <span className="font-mono text-[10px] uppercase">Home</span>
      </Link>
      <Link href="/categories" className="flex flex-col items-center gap-1 text-ink">
        <Grid2x2 size={20} />
        <span className="font-mono text-[10px] uppercase">Categories</span>
      </Link>
      <Link href="/wishlist" className="flex flex-col items-center gap-1 text-ink">
        <Heart size={20} />
        <span className="font-mono text-[10px] uppercase">Wishlist</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-ink">
        <User size={20} />
        <span className="font-mono text-[10px] uppercase">Profile</span>
      </Link>
    </nav>
  );
}
