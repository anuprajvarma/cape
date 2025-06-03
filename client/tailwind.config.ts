import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        slaty: "#D1D5DB",
        mediumSlaty: "#1F2937",
        lightSlaty: "#374151",
        darkBlue: "#101827",
        lightBlue: "#1A56DB",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
