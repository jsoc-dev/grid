import type { BuildOptions } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

/** Single React instance — workspace packages may resolve their own react@18 peer copy. */
const reactRoot = path.join(packageRoot, "node_modules/react");
const reactDomRoot = path.join(packageRoot, "node_modules/react-dom");

type ConfigOptions = {
  production: boolean;
};

export function getWebviewConfig({ production }: ConfigOptions): BuildOptions {
  return {
    entryPoints: ["src/ui/webview.tsx"],
    outfile: "dist/webview.js",
    bundle: true,
    platform: "browser",
    format: "iife",
    jsx: "automatic",
    loader: { ".css": "css", ".svg": "text" },
    alias: {
      react: reactRoot,
      "react-dom": reactDomRoot,
      "react/jsx-runtime": path.join(reactRoot, "jsx-runtime.js"),
      "react/jsx-dev-runtime": path.join(reactRoot, "jsx-dev-runtime.js"),
    },
    minify: production,
    sourcemap: !production,
    logLevel: "info",
  };
}
