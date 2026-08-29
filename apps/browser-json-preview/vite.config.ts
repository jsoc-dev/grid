import manifest from "#manifest.config.ts";

import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
