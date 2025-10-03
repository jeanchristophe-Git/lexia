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
        // VRAIES couleurs Claude.ai
        claude: {
          'user-bubble': '#2B5CE6', // Bleu vif pour messages utilisateur
          'assistant-bubble': '#2A2A2A', // Gris foncé pour messages assistant
          'bg-main': '#0F0F0F', // Fond principal noir
          'sidebar': '#171717', // Sidebar gris très foncé
          'border': '#2A2A2A', // Bordures grises
          'text-light': '#E5E5E5', // Texte clair
          'text-secondary': '#9CA3AF', // Texte secondaire
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