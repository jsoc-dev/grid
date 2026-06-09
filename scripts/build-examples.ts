import { REPO_DIR } from "#repo.ts";
import { logMilestone } from "#scripts/utils/logMilestone.ts";

import path from "node:path";

import {
  type FrameworkId,
  getExamplesRelativePath,
  getFrameworkIds,
  getFrameworkMetadata,
  getPluginIds,
  type PluginId,
} from "@jsoc/grid-docs";
import inquirer from "inquirer";
import { build } from "vite";

await main();

async function main() {
  try {
    const manualMode = process.argv.includes("manual");
    const frameworkIdsToBuild = manualMode
      ? await askFrameworkIdsToBuild()
      : getFrameworkIds();

    for (const frameworkId of frameworkIdsToBuild) {
      const allPluginIds = getPluginIds(frameworkId);
      let buildPluginIds = allPluginIds;

      if (manualMode && allPluginIds.length > 0) {
        buildPluginIds = await getPluginIdsFromUser(frameworkId, allPluginIds);
      }

      if (!buildPluginIds.length) {
        console.info(`No plugins selected for "${frameworkId}". Skipping...\n`);
        continue;
      }

      // Sequential build (not parallelized to keep it simple)
      for (const pluginId of buildPluginIds) {
        const packageId = `${frameworkId}/${pluginId}`;
        logMilestone(`📦 Build started for "${packageId}"`, "start");
        await buildExamples(frameworkId, pluginId);
        logMilestone(`✅ Build completed for "${packageId}"`, "end");
      }
    }
  } catch (err) {
    console.error("\n❌ Build failed", err);
    process.exit(1);
  }
}

async function askFrameworkIdsToBuild(): Promise<FrameworkId[]> {
  const { frameworkIds } = await inquirer.prompt<{
    frameworkIds: FrameworkId[];
  }>([
    {
      type: "checkbox",
      name: "frameworkIds",
      message: "Select which frameworks to build examples for:",
      choices: getFrameworkIds().map((frameworkId) => {
        const { name } = getFrameworkMetadata(frameworkId);
        return {
          name: `${name} (${frameworkId})`,
          value: frameworkId,
        };
      }),
    },
  ]);

  if (!frameworkIds.length) {
    throw new Error("No frameworks selected. Exiting.");
  }

  return frameworkIds;
}

async function getPluginIdsFromUser<F extends FrameworkId>(
  frameworkId: F,
  choices: PluginId<F>[],
): Promise<PluginId<F>[]> {
  const { pluginIds } = await inquirer.prompt<{
    pluginIds: PluginId<F>[];
  }>([
    {
      type: "checkbox",
      name: "pluginIds",
      message: `Select for which of the following plugins of "${frameworkId}", the examples should be build:`,
      choices,
    },
  ]);

  return pluginIds;
}

async function buildExamples<F extends FrameworkId>(
  frameworkId: F,
  pluginId: PluginId<F>,
) {
  const sourceDir = getExamplesSourceDir(frameworkId, pluginId);
  const outputDir = getExamplesOutputDir(frameworkId, pluginId);

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

function getExamplesSourceDir<F extends FrameworkId>(
  frameworkId: F,
  pluginId: PluginId<F>,
): string {
  return path.resolve(REPO_DIR, getExamplesRelativePath(frameworkId, pluginId));
}

function getExamplesOutputDir<F extends FrameworkId>(
  frameworkId: F,
  pluginId: PluginId<F>,
): string {
  return path.resolve(
    REPO_DIR,
    "docs/public",
    getExamplesRelativePath(frameworkId, pluginId),
  );
}
