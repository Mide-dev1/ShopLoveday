import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import BottomNav from "@/components/BottomNav";
import FloatingPetals from "@/components/FloatingPetals";
import "./globals.css";

// next/font downloads and self-hosts these fonts at build time —
// faster and more private than linking Google's CDN directly in the HTML.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-general",
  weight: ["400", "500", "600"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ShopLoveday — Modern Nigerian Fashion",
  description: "Tops, shorts, bags and accessories, curated with love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-body`}
      >
        <AuthProvider>
          <CartProvider>
            <FloatingPetals />
            <div className="pb-20">{children}</div>
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
