"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid2x2, Shirt, ShoppingBag, Gem, Heart, ShoppingCart, User } from "lucide-react";

type MenuDrawerProps = {
    open: boolean;
    onClose: () => void;
};

// Every row in the drawer — icon + label + destination, in the order they render.
const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Grid2x2 },
    { label: "Tops", href: "/category/tops", icon: Shirt },
    { label: "Shorts", href: "/category/shorts", icon: Shirt },
    { label: "Bags", href: "/category/bags", icon: ShoppingBag },
    { label: "Accessories", href: "/category/accessories", icon: Gem },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "My Cart", href: "/cart", icon: ShoppingCart },
    { label: "Profile", href: "/profile", icon: User },
];

export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop — dims the page behind the drawer and closes it on click.
              Fades in/out independently of the drawer's slide animation. */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-ink/40"
                    />

                    {/* The drawer itself: pinned to the left edge, full viewport height.
              x: "-100%" -> 0 is what makes it slide in from the left instead
              of dropping down — the old dropdown animated on the y axis. */}
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-paper shadow-xl"
                    >
                        <div className="border-b border-line px-6 py-6">
                            <p className="font-display text-xl text-ink">
                                Shop<span className="italic">Loveday</span>
                            </p>
                        </div>

                        <nav className="flex flex-col py-2">
                            {links.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={onClose}
                                    className="flex items-center gap-4 border-b border-line px-6 py-4 font-body text-sm text-ink transition-colors hover:bg-line"
                                >
                                    <Icon size={18} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
