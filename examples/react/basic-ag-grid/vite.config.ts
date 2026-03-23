import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/examples/basic-ag-grid/",
  build: {
    outDir: "../../../docs/public/examples/basic-ag-grid",
    emptyOutDir: true,
  },
});
