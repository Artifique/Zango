import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        charcoal: "var(--charcoal)",
        foreground: "var(--foreground)",
        teal: {
          DEFAULT: "#00E5C3",
          hover: "#00C4A7",
        },
        amber: {
          DEFAULT: "#F5A623",
          hover: "#D48A1B",
        },
        danger: "#FF4D6A",
        success: "#00C896",
        card: "var(--card)",
        border: "var(--border)",
      },
      fontFamily: {
        syne: ["var(--font-syne)"],
        mono: ["var(--font-ibm-plex-mono)"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(0, 229, 195, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 195, 0.03) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink-dot": "blink 1.5s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
