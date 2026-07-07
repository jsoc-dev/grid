import { REPO_DIR } from "#repo.ts";
import {
  emitExampleSourceManifest,
  isSourceManifestUpToDate,
} from "#scripts/utils/emitExampleSourceManifest.ts";
import { getLatestModifiedTime } from "#scripts/utils/getLatestModifiedTime.ts";
import { logMilestone } from "#scripts/utils/logMilestone.ts";

import { stat } from "node:fs/promises";
import path from "node:path";

import {
  type AdapterId,
  getAdapterIds,
  getAdapterMetadata,
  getExamplesRelativePath,
  getPluginIds,
  type PluginId,
} from "@jsoc/grid-docs";
import inquirer from "inquirer";
import { build } from "vite";

async function main() {
  try {
    const manualMode = process.argv.includes("--manual");
    const forceMode = process.argv.includes("--force");
    const dryRunMode = process.argv.includes("--dry-run");
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

        const buildUpToDate = await isBuildUpToDate(
          sourceDir,
          outputDir,
          dryRunMode,
        );
        const manifestUpToDate = await isSourceManifestUpToDate(
          sourceDir,
          outputDir,
        );

        const doRebuild = forceMode || !buildUpToDate;
        const doEmitManifest = forceMode || doRebuild || !manifestUpToDate;

        if (dryRunMode) {
          console.info(`\n📊 Status for "${packageId}":`);
          console.info(
            `  - Rebuild required:          ${doRebuild ? "⚠️ Yes" : "✅ No"}`,
          );
          console.info(
            `  - Re-emit manifest required: ${doEmitManifest ? "⚠️ Yes" : "✅ No"}`,
          );
          continue;
        }

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

async function isBuildUpToDate(
  sourceDir: string,
  outputDir: string,
  dryRunMode: boolean,
): Promise<boolean> {
  try {
    const indexPath = path.resolve(outputDir, "index.html");
    const indexHtmlStat = await stat(indexPath);
    const {
      time: sourceTime,
      file: maxFile,
      scannedFiles,
    } = await getLatestModifiedTime(sourceDir);
    const upToDate = indexHtmlStat.mtimeMs > sourceTime;

    if (dryRunMode) {
      console.log(`\n[DRY-RUN] Cache check for ${sourceDir}:`);
      console.log(
        `  index.html: ${new Date(indexHtmlStat.mtimeMs).toISOString()} (${indexHtmlStat.mtimeMs})`,
      );
      console.log(
        `  Newest file: ${maxFile} -> ${new Date(sourceTime).toISOString()} (${sourceTime})`,
      );
      console.log(`  Up to date: ${upToDate}`);
      if (!upToDate) {
        const newerFiles = scannedFiles
          .filter((f) => f.time > indexHtmlStat.mtimeMs)
          .sort((a, b) => b.time - a.time);
        console.log(`  Modified files causing rebuild:`);
        newerFiles.slice(0, 10).forEach((f) => {
          console.log(`    - ${f.file} (${new Date(f.time).toISOString()})`);
        });
      }
    }

    return upToDate;
  } catch (err) {
    if (dryRunMode) {
      console.log(`\n[DRY-RUN] Cache check failed for ${sourceDir}:`, err);
    }
    return false;
  }
}

await main();
