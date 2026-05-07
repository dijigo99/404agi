import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        fg: "var(--fg)",
        "fg-dim": "var(--fg-dim)",
        accent: "var(--accent)",
        error: "var(--error)",
        warn: "var(--warn)",
        border: "var(--border)",
        glitch1: "var(--glitch-1)",
        glitch2: "var(--glitch-2)",
        background: "var(--bg)",
        foreground: "var(--fg)",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0",
        sm: "2px",
        md: "4px",
        lg: "6px",
      },
      keyframes: {
        "glitch-skew": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -2px)" },
          "80%": { transform: "translate(1px, 2px)" },
        },
        "glitch-text": {
          "0%, 92%, 100%": {
            textShadow: "none",
            transform: "translate(0,0)",
          },
          "94%": {
            textShadow:
              "2px 0 var(--glitch-1), -2px 0 var(--glitch-2)",
            transform: "translate(-1px,0)",
          },
          "96%": {
            textShadow:
              "-2px 0 var(--glitch-1), 2px 0 var(--glitch-2)",
            transform: "translate(1px,0)",
          },
          "98%": {
            textShadow: "0 0 var(--glitch-1), 0 0 var(--glitch-2)",
            transform: "translate(0,0)",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ticker-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "glitch-text": "glitch-text 6s infinite steps(1)",
        "glitch-skew": "glitch-skew 200ms infinite steps(2)",
        scanline: "scanline 8s linear infinite",
        blink: "blink 1.1s step-end infinite",
        "fade-in-up": "fade-in-up 600ms ease-out forwards",
        "ticker-pulse": "ticker-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
