import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      // resolve imports of "ag-grid-community" to local file
      name: "alias-ag-grid-community",
      enforce: "pre",
      resolveId(source, importer) {
        if (
          source === "ag-grid-community" &&
          importer &&
          !importer.endsWith("ag-grid-community.ts")
        ) {
          return path.resolve(__dirname, "src/ag-grid-community.ts");
        }
      },
    },
  ],
});
