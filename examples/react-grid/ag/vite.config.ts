import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      // resolve imports of "ag-grid-react" to local file
      name: "alias-ag-grid-react",
      enforce: "pre",
      resolveId(source, importer) {
        if (
          source === "ag-grid-react" &&
          importer &&
          !importer.endsWith("ag-grid-react.tsx")
        ) {
          return path.resolve(__dirname, "src/ag-grid-react.tsx");
        }
      },
    },
  ],

  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
