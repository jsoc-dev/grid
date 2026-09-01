import manifest from "#manifest.config.ts";

import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react(), crx({ manifest })],
  build: {
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
