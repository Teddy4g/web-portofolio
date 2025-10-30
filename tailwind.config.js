/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0b0b0b",
        muted: "#666666",
        primary: "#0b0b0b",
        "primary-foreground": "#ffffff",
        border: "#eaeaea",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
    },
  },
  safelist: [
  "bg-gradient-to-r",
  "from-neutral-900",
  "to-neutral-500",
  "text-transparent",
  "bg-clip-text",
],

  plugins: [],
};
