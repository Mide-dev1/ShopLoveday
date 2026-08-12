import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome palette. Named by role, not by hex, so a future
        // shade tweak only ever needs to happen in this one place.
        paper: "#FFFFFF",   // page background
        ink: "#111111",     // primary text, buttons, brand color
        muted: "#6B6B6B",   // secondary text (captions, categories)
        line: "#E5E5E5",    // borders, dividers, subtle fills
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-general)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
