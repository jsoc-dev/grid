import path, { resolve } from "node:path";

import { readFileSync } from "node:fs";
import {
  parsePackageJson,
  type AdapterId,
  type PackageJson,
  type PluginId,
} from "@jsoc/grid-docs";

export function getPackageJson(
  adapterId: AdapterId,
  pluginId?: PluginId,
): PackageJson | null {
  const cwd = process.cwd();

  const packageDirBase = path.join(cwd, "..", "packages");

  let packageDir: string | undefined;

  if (pluginId) {
    packageDir = path.join(
      packageDirBase,
      adapterId + "-plugins",
      adapterId + "-" + pluginId,
    );
  } else {
    packageDir = path.join(packageDirBase, adapterId);
  }

  const packageJsonPath = resolve(packageDir, "package.json");
  const packageJsonText = readFileSync(packageJsonPath, "utf8");

  return parsePackageJson(packageJsonText);
}
