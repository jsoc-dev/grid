import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { type PackageJson, parsePackageJson } from "@jsoc/grid-docs";

export function getPackageJson(packageDir: string): PackageJson | null {
  const path = resolve(packageDir, "package.json");
  const fileContent = readFileSync(path, "utf8");
  return parsePackageJson(fileContent);
}
