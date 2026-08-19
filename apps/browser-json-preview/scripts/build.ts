import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { type BuildOptions, context } from "esbuild";

const packageRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const args = process.argv.slice(2);
const isWatch = args.includes("--watch");
const isProduction = args.includes("--production");

const reactRoot = path.join(packageRoot, "node_modules/react");
const reactDomRoot = path.join(packageRoot, "node_modules/react-dom");

async function build() {
  const options: BuildOptions = {
    entryPoints: [path.join(packageRoot, "src/content.tsx")],
    outdir: path.join(packageRoot, "dist"),
    bundle: true,
    platform: "browser",
    format: "iife",
    jsx: "automatic",
    alias: {
      react: reactRoot,
      "react-dom": reactDomRoot,
      "react/jsx-runtime": path.join(reactRoot, "jsx-runtime.js"),
      "react/jsx-dev-runtime": path.join(reactRoot, "jsx-dev-runtime.js"),
    },
    loader: { ".css": "css", ".svg": "text" },
    minify: isProduction,
    sourcemap: !isProduction,
    logLevel: "info",
  };

  if (isWatch) {
    const ctx = await context(options);
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    const ctx = await context(options);
    await ctx.rebuild();
    await ctx.dispose();
    fs.copyFileSync(
      path.join(packageRoot, "manifest.json"),
      path.join(packageRoot, "dist", "manifest.json"),
    );
    console.log("Build complete");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
