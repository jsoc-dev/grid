import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "mui/index": "src/mui/index.ts",
    "ag/index": "src/ag/index.ts",
    "ant/index": "src/ant/index.ts",
    "mantine/index": "src/mantine/index.ts",
    "prime/index": "src/prime/index.ts",
    "tanstack/index": "src/tanstack/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "@mui/x-data-grid",
    "@tanstack/react-table",
    "ag-grid-community",
    "ag-grid-react",
    "antd",
    "mantine-react-table",
    "primereact",
  ],
});
