import packageJson from "#package.json";

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const editor = process.argv[2];

if (!editor) {
  console.error("Usage: pnpm run install-local <editor>");
  console.error("Example: pnpm run install-local code");
  console.error("         pnpm run install-local cursor");
  process.exit(1);
}

const packageDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const vsixPath = join(packageDir, `json-preview-${packageJson.version}.vsix`);

if (!existsSync(vsixPath)) {
  console.error(`VSIX not found: ${vsixPath}`);
  console.error("Run `pnpm run package` first.");
  process.exit(1);
}

const result = spawnSync(editor, ["--install-extension", vsixPath], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
