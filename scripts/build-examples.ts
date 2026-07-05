import { REPO_DIR } from "#repo.ts";
import { emitExampleSourceManifest } from "#scripts/utils/emitExampleSourceManifest.ts";
import { logMilestone } from "#scripts/utils/logMilestone.ts";

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import {
  type AdapterId,
  EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
  getAdapterIds,
  getAdapterMetadata,
  getExamplesRelativePath,
  getPluginIds,
  type PluginId,
} from "@jsoc/grid-docs";
import inquirer from "inquirer";
import { build } from "vite";

await main();

async function main() {
  try {
    const manualMode = process.argv.includes("--manual");
    const forceMode = process.argv.includes("--force");
    const adapterIdsToBuild = manualMode
      ? await askAdapterIdsToBuild()
      : getAdapterIds();

    for (const adapterId of adapterIdsToBuild) {
      const allPluginIds = getPluginIds(adapterId);
      let buildPluginIds = allPluginIds;

      if (manualMode && allPluginIds.length > 0) {
        buildPluginIds = await getPluginIdsFromUser(adapterId, allPluginIds);
      }

      if (!buildPluginIds.length) {
        console.info(`No plugins selected for "${adapterId}". Skipping...\n`);
        continue;
      }

      // Sequential build (not parallelized to keep it simple)
      for (const pluginId of buildPluginIds) {
        const packageId = `${adapterId}/${pluginId}`;
        const sourceDir = getExamplesSourceDir(adapterId, pluginId);
        const outputDir = getExamplesOutputDir(adapterId, pluginId);

        const buildUpToDate = await isBuildUpToDate(sourceDir, outputDir);
        const manifestUpToDate = await isSourceManifestUpToDate(
          sourceDir,
          outputDir,
        );

        const doRebuild = forceMode || !buildUpToDate;
        const doEmitManifest = forceMode || doRebuild || !manifestUpToDate;

        if (!doRebuild && !doEmitManifest) {
          console.info(`\n⏭️ Skipping "${packageId}" (already up to date)`);
          continue;
        }

        if (doRebuild) {
          logMilestone(`📦 Build started for "${packageId}"`, "start");
          await buildExamples(sourceDir, outputDir);
          logMilestone(`✅ Build completed for "${packageId}"`, "end");
        }

        if (doEmitManifest) {
          console.log(`\nEmitting manifest for "${packageId}"...`);
          await emitExampleSourceManifest(sourceDir, outputDir);
        }
      }
    }
  } catch (err) {
    console.error("\n❌ Build failed", err);
    process.exit(1);
  }
}

async function askAdapterIdsToBuild(): Promise<AdapterId[]> {
  const { adapterIds } = await inquirer.prompt<{
    adapterIds: AdapterId[];
  }>([
    {
      type: "checkbox",
      name: "adapterIds",
      message: "Select which adapters to build examples for:",
      choices: getAdapterIds().map((adapterId) => {
        const { name } = getAdapterMetadata(adapterId);
        return {
          name: `${name} (${adapterId})`,
          value: adapterId,
        };
      }),
    },
  ]);

  if (!adapterIds.length) {
    throw new Error("No adapters selected. Exiting.");
  }

  return adapterIds;
}

async function getPluginIdsFromUser<A extends AdapterId>(
  adapterId: A,
  choices: PluginId<A>[],
): Promise<PluginId<A>[]> {
  const { pluginIds } = await inquirer.prompt<{
    pluginIds: PluginId<A>[];
  }>([
    {
      type: "checkbox",
      name: "pluginIds",
      message: `Select for which of the following plugins of "${adapterId}", the examples should be build:`,
      choices,
    },
  ]);

  return pluginIds;
}

async function buildExamples(sourceDir: string, outputDir: string) {
  console.log("SOURCE DIR:", sourceDir);
  console.log("OUTPUT DIR:", outputDir, "\n");

  await build({
    root: sourceDir,

    // this will make sure links in index.html uses "./" instead of "/" to get assets/ files.
    // Since "/" will resolve to "/public/" (docsite root) which won't contain assets/ files
    base: "./",

    build: {
      chunkSizeWarningLimit: 2000,
      outDir: outputDir,
      emptyOutDir: true,
    },
  });
}

function getExamplesSourceDir<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>,
): string {
  return path.resolve(REPO_DIR, getExamplesRelativePath(adapterId, pluginId));
}

function getExamplesOutputDir<A extends AdapterId>(
  adapterId: A,
  pluginId: PluginId<A>,
): string {
  return path.resolve(
    REPO_DIR,
    "docs/public",
    getExamplesRelativePath(adapterId, pluginId),
  );
}

async function getLatestModifiedTime(dir: string): Promise<number> {
  let maxTime = 0;
  try {
    const dirStat = await stat(dir);
    maxTime = dirStat.mtimeMs; // Catches file additions/deletions in this directory
  } catch {
    // Ignore if dir doesn't exist for some reason
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    if (entry.isDirectory()) {
      const time = await getLatestModifiedTime(fullPath);
      maxTime = Math.max(maxTime, time);
    } else {
      const stats = await stat(fullPath);
      maxTime = Math.max(maxTime, stats.mtimeMs);
    }
  }
  return maxTime;
}

async function isBuildUpToDate(
  sourceDir: string,
  outputDir: string,
): Promise<boolean> {
  try {
    const indexHtmlStat = await stat(path.resolve(outputDir, "index.html"));
    const sourceTime = await getLatestModifiedTime(sourceDir);
    return indexHtmlStat.mtimeMs > sourceTime;
  } catch {
    return false;
  }
}

async function isSourceManifestUpToDate(
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
    const sourceTime = await getLatestModifiedTime(sourceDir);

    return (
      manifestStat.mtimeMs > sourceTime &&
      manifestStat.mtimeMs > emitterStat.mtimeMs
    );
  } catch {
    return false;
  }
}
