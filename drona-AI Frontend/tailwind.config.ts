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
        // Drona AI Environment Colors
        "env-main-learning": "#2a5cff", // Blue
        "env-test": "#e8362a", // Red
        "env-game": "#c9a84c", // Gold
        "env-workspace": "#00c896", // Green
        "env-resources": "#9b5de5", // Purple
        "env-career": "#1a1a2e", // Navy-Silver
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "environment-transition": {
          "0%": { opacity: "0.5", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "env-transition": "environment-transition 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
