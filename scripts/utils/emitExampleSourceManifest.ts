import { transpileTsFile } from "#scripts/utils/transpileTsFile.ts";

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
  type ExampleSourceManifest,
} from "@jsoc/grid-docs";

const SOURCE_FILE_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
]);

export async function emitExampleSourceManifest(
  sourceDir: string,
  outputDir: string,
) {
  const manifest = await createExampleSourceManifest(sourceDir);
  const outputFile = path.resolve(outputDir, EXAMPLE_SOURCE_MANIFEST_FILE_NAME);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(manifest, null, 2));
}

async function createExampleSourceManifest(
  sourceDir: string,
): Promise<ExampleSourceManifest> {
  const filePaths = await collectRelevantFilePaths(sourceDir);
  const manifest: ExampleSourceManifest = {};

  for (const filePath of filePaths) {
    const absolutePath = path.resolve(sourceDir, filePath);
    const content = await readFile(absolutePath, "utf8");
    manifest[filePath] = content;

    if ((filePath.endsWith(".ts") || filePath.endsWith(".tsx")) && !filePath.endsWith(".d.ts")) {
      const isTsx = filePath.endsWith(".tsx");
      const jsFilePath = filePath.replace(/\.tsx?$/, isTsx ? ".jsx" : ".js");

      manifest[jsFilePath] = await transpileTsFile(content, isTsx);
    }
  }

  return manifest;
}

async function collectRelevantFilePaths(sourceDir: string): Promise<string[]> {
  const filePaths: string[] = [];

  const rootFiles = ["index.html", "package.json", "vite.config.ts"];
  for (const file of rootFiles) {
    if (await pathExists(path.resolve(sourceDir, file))) {
      filePaths.push(file);
    }
  }

  const srcDir = path.resolve(sourceDir, "src");
  if (await pathExists(srcDir)) {
    const srcFilePaths = await collectFilesRecursively(srcDir, sourceDir);
    filePaths.push(...srcFilePaths);
  }

  return filePaths.sort((left, right) => left.localeCompare(right));
}

async function collectFilesRecursively(
  directory: string,
  sourceDir: string,
): Promise<string[]> {
  const filePaths: string[] = [];
  const directoryItems = await readdir(directory, { withFileTypes: true });

  for (const item of directoryItems) {
    const itemPath = path.resolve(directory, item.name);

    if (item.isDirectory()) {
      filePaths.push(...(await collectFilesRecursively(itemPath, sourceDir)));
      continue;
    }

    if (!SOURCE_FILE_EXTENSIONS.has(path.extname(item.name))) {
      continue;
    }

    filePaths.push(toPosixPath(path.relative(sourceDir, itemPath)));
  }

  return filePaths;
}

async function pathExists(filePath: string) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    try {
      await readdir(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}
