import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/examples/basic-mantine-react-table/",
  build: {
    outDir: "../../../docs/public/examples/basic-mantine-react-table",
    emptyOutDir: true,
  },
});
