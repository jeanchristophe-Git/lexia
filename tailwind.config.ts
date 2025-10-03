import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design BLANC moderne et professionnel
        primary: {
          DEFAULT: '#2563EB', // Bleu moderne
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        accent: {
          DEFAULT: '#8B5CF6', // Violet accent
          light: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "typing": "typing 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        typing: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;