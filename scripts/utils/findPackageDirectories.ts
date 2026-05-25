import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Recursively finds directories under given directory that contain a `package.json`.
 */
export async function findPackageDirectories(
  directory: string,
): Promise<string[]> {
  const packageDirectories: string[] = [];
  const directoryItems = await readdir(directory, { withFileTypes: true });

  if (
    directoryItems.some((item) => item.isFile() && item.name === "package.json")
  ) {
    packageDirectories.push(directory);
  }

  for (const item of directoryItems) {
    if (!item.isDirectory() || item.name === "node_modules") {
      continue;
    }

    const subDirectory = resolve(directory, item.name);
    const packageDirectoriesInSubDirectory =
      await findPackageDirectories(subDirectory);
    packageDirectories.push(...packageDirectoriesInSubDirectory);
  }

  return packageDirectories;
}
