import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anbar: {
          bg: "#FAF7F2",
          card: "#FFFFFF",
          surface: "#F5EFE6",
          amber: "#DA9542",       /* Rich solar amber gold */
          "amber-dark": "#C68233",
          slate: "#587388",       /* Aegean slate blue */
          sage: "#7C9071",        /* Olive sage */
          rust: "#A84A34",        /* Terracotta pomegranate */
          dark: "#1F1B16",        /* Deep espresso charcoal */
          subtle: "#EAE2D5",      /* Stone cream divider */
          border: "#E2D9CA",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        sans: ["var(--font-cairo)", "Cairo", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(31, 27, 22, 0.04)",
        elevated: "0 16px 40px rgba(31, 27, 22, 0.08)",
        glow: "0 0 25px rgba(218, 149, 66, 0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
