import type { BuildOptions } from "esbuild";

type ConfigOptions = {
  production: boolean;
};

export function getExtensionConfig({
  production,
}: ConfigOptions): BuildOptions {
  return {
    entryPoints: ["src/ext/extension.ts"],
    outfile: "dist/extension.cjs",
    bundle: true,
    platform: "node",
    format: "cjs",
    external: ["vscode"],
    loader: { ".html": "text" },
    target: "node18",
    minify: production,
    sourcemap: !production,
    logLevel: "info",
  };
}
