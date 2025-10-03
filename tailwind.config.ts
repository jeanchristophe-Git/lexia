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
        // Palette Claude.ai
        claude: {
          primary: '#CC785C',
          'primary-dark': '#B5644A',
          'primary-light': '#E09780',
        },
        background: '#FFFFFF',
        surface: '#F5F5F5',
        border: '#E5E5E5',
        text: {
          primary: '#1F1F1F',
          secondary: '#666666',
        }
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