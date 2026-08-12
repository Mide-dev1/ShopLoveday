"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/types";

export type CartItem = { product: Product; quantity: number };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
};

// Context needs a default value for TypeScript, even though it's always
// overridden by the real Provider below — this default is never actually used.
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Tracks whether we've finished reading from localStorage yet.
  // Without this, the "save" effect below can fire with the initial
  // empty array BEFORE the "restore" effect applies, wiping the saved cart.
  const [hydrated, setHydrated] = useState(false);

  // On first load in the browser, restore whatever was in the cart last time.
  // This runs once (empty dependency array) after the component mounts.
  useEffect(() => {
    const saved = localStorage.getItem("shoploveday-cart");
    if (saved) setItems(JSON.parse(saved));
    setHydrated(true); // only now is it safe to start saving
  }, []);

  // Every time `items` changes, save it back to localStorage —
  // so refreshing the page doesn't wipe the cart. Guarded by `hydrated`
  // so this can't run before the restore above has had a chance to apply.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("shoploveday-cart", JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        // Already in cart — just bump the quantity instead of adding a duplicate row.
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

// A small hook so components just call useCart() instead of importing
// useContext + CartContext everywhere. Throws a clear error if misused.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
