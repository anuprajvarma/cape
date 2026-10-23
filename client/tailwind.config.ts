import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  // Your existing configuration...
  theme: {
    extend: {
      typography: (plugin) => ({
        slate: {
          css: {
            p: {
              color: plugin.theme("colors.slaty"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;
