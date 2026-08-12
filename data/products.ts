import { Product } from "@/lib/types";

export const products: Product[] = [
  { id: "1", name: "Ankara Wrap Top", price: 15000, category: "Tops", image: "/placeholder.jpg" },
  { id: "2", name: "Silk Blouse", price: 18500, category: "Tops", image: "/placeholder.jpg" },
  { id: "3", name: "Linen Shorts", price: 12000, category: "Shorts", image: "/placeholder.jpg" },
  { id: "4", name: "Denim Shorts", price: 13500, category: "Shorts", image: "/placeholder.jpg" },
  { id: "5", name: "Woven Tote Bag", price: 22000, category: "Bags", image: "/placeholder.jpg" },
  { id: "6", name: "Leather Crossbody", price: 27000, category: "Bags", image: "/placeholder.jpg" },
  { id: "7", name: "Beaded Choker", price: 6000, category: "Accessories", image: "/placeholder.jpg" },
  { id: "8", name: "Gold Hoop Earrings", price: 8500, category: "Accessories", image: "/placeholder.jpg" },
];

// Simple lookup helpers — small enough not to need a database query yet.
export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

// Used by the search page — checks both the product name and its category
// so searching "bag" matches products named with "bag" AND anything in
// the Bags category.
export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}
