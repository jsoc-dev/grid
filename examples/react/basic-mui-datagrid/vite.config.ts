import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/examples/basic-mui-datagrid/",
  build: {
    outDir: "../../../docs/public/examples/basic-mui-datagrid",
    emptyOutDir: true,
  },
});
