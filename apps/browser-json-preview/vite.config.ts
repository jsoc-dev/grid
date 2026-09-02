import manifest from "#manifest.config.ts";
import pkg from "#package.json" with { type: "json" };

import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
    crx({ manifest }),
    mode === "package" &&
      zipPack({
        outDir: "release",
        outFileName: `${pkg.name}-v${pkg.version}.zip`,
      }),
  ],
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
}));
