import { REPO_DIR } from "#repo.ts";
import { getLatestModifiedTime } from "#scripts/utils/getLatestModifiedTime.ts";
import { transpileTsFile } from "#scripts/utils/transpileTsFile.ts";
import { transpileVueSfc } from "#scripts/utils/transpileVueSfc.ts";

import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  type ExampleSourceFile,
  getCodeLanguageByFilePath,
  getFileExtension,
  type SourceCodeVariants,
  vueSfcContainsTsScript,
} from "@jsoc/grid-docs";
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
    const sourceCode = await readFile(absolutePath, "utf8");
    const fileExtension = getFileExtension(filePath);

    manifest[filePath] = await prepareSourceFile(filePath, sourceCode);

    // add additional js/jsx files for ts/tsx source files
    if (["ts", "tsx"].includes(fileExtension!) && !filePath.endsWith(".d.ts")) {
      const isTsx = fileExtension === "tsx";
      const jsFilePath = filePath.replace(/\.tsx?$/, isTsx ? ".jsx" : ".js");
      const jsCode = await transpileTsFile(sourceCode, isTsx);

      manifest[jsFilePath] = await prepareSourceFile(jsFilePath, jsCode);
    }
  }

  return manifest;
}

async function prepareSourceFile(
  path: string,
  code: string,
): Promise<ExampleSourceFile> {
  const name = path.split("/").pop()!;
  const language = getCodeLanguageByFilePath(path);
  const fileExt = getFileExtension(path);
  let variants: SourceCodeVariants | undefined = undefined;

  if (fileExt === "vue" && vueSfcContainsTsScript(code)) {
    const jsCode = await transpileVueSfc(code);
    variants = { javascript: jsCode };
  }

  return { path, code, name, language, variants };
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

export async function isSourceManifestUpToDate(
  sourceDir: string,
  outputDir: string,
): Promise<boolean> {
  try {
    const manifestStat = await stat(
      path.resolve(outputDir, EXAMPLE_SOURCE_MANIFEST_FILE_NAME),
    );
    const emitterStat = await stat(
      path.resolve(REPO_DIR, "scripts/utils/emitExampleSourceManifest.ts"),
    );
    const { time: sourceTime } = await getLatestModifiedTime(sourceDir);

    return (
      manifestStat.mtimeMs > sourceTime &&
      manifestStat.mtimeMs > emitterStat.mtimeMs
    );
  } catch {
    return false;
  }
}
