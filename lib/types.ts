export type Product = {
  id: string;
  name: string;
  price: number; // stored in Naira, as a whole number (no kobo)
  category: "Tops" | "Shorts" | "Bags" | "Accessories";
  image: string;
};
