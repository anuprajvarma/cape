import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { type PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: (plugin: PluginAPI) => ({
        slate: {
          css: {
            p: {
              color: plugin.theme("colors.slaty"),
            },
            ul: {
              color: plugin.theme("colors.slaty"),
            },
            ol: {
              color: plugin.theme("colors.slaty"),
            },
            h1: {
              color: plugin.theme("colors.white"),
            },
            h2: {
              color: plugin.theme("colors.white"),
            },
            h3: {
              color: plugin.theme("colors.white"),
            },
            h4: {
              color: plugin.theme("colors.white"),
            },
            h5: {
              color: plugin.theme("colors.white"),
            },
            h6: {
              color: plugin.theme("colors.white"),
            },
            strong: {
              color: plugin.theme("colors.white"),
            },
          },
        },
      }),
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
