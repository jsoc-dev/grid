import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type PackageJson = {
  name?: string;
};

export function getPackageJson(packageDir: string): PackageJson | null {
  const path = resolve(packageDir, "package.json");
  const fileContent = readFileSync(path, "utf8");
  const parsed = JSON.parse(fileContent) as unknown;

  if (typeof parsed === "object") {
    return parsed;
  }

  return null;
}
