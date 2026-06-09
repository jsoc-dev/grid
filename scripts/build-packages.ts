import { REPO_DIR } from "#repo.ts";
import { findPackageDirectories } from "#scripts/utils/findPackageDirectories.ts";
import { getPackageJson } from "#scripts/utils/getPackageJson.ts";
import { logMilestone } from "#scripts/utils/logMilestone.ts";

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { ensureError, isPlainObject } from "@jsoc/utils";
import { build, type UserConfig } from "tsdown";

type BuildConfig = UserConfig;

const CWD = process.cwd();
const INIT_CWD = process.env.INIT_CWD;
const PACKAGES_DIR = resolve(REPO_DIR, "packages");
const CONFIG_FILE = "tsdown.config.ts";

const DEFAULT_BUILD_CONFIG = {
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  outputOptions: {
    chunkFileNames: "shared-[hash].mjs",
  },
} satisfies BuildConfig;

await main();

async function main() {
  const packageDirectory = [INIT_CWD, CWD].find(
    (dir) => dir && dir !== REPO_DIR,
  );
  const packageDirectories = packageDirectory
    ? [packageDirectory]
    : await findPackageDirectories(PACKAGES_DIR);

  console.info(`📦 Number of packages to build: ${packageDirectories.length}`);
  for (const dir of packageDirectories) {
    try {
      await buildPackage(dir);
    } catch (error) {
      console.error("❌ Failed to build package.", error);
      process.exit(1);
    }
  }
  console.info(`✅ Number of packages built: ${packageDirectories.length}`);
}

async function buildPackage(packageDirectory: string) {
  const packageJson = getPackageJson(packageDirectory);

  if (!packageJson) {
    throw new Error(`No package.json found in ${packageDirectory}`);
  }

  logMilestone(`📦 Build started for "${packageJson.name}"`, "start");
  console.info(`Package directory: ${packageDirectory}`);
  const config = await getBuildConfig(packageDirectory);

  const previousCwd = process.cwd();

  try {
    process.chdir(packageDirectory);
    await build(config);
  } finally {
    process.chdir(previousCwd);
  }

  logMilestone(`✅ Build completed for "${packageJson.name}"`, "end");
}

async function getBuildConfig(packageDirectory: string): Promise<BuildConfig> {
  let overrides;

  try {
    const configPath = resolve(packageDirectory, CONFIG_FILE);
    const configModuleUrl = pathToFileURL(configPath).href;
    const configModule = (await import(configModuleUrl)) as unknown;

    if (
      !configModule ||
      !isPlainObject(configModule) ||
      !("default" in configModule) ||
      !isPlainObject(configModule.default)
    ) {
      throw new Error(`${CONFIG_FILE} must default export an object.`);
    }

    overrides = configModule.default;
  } catch (catched) {
    const error = ensureError(catched);

    if ("code" in error && error.code === "ERR_MODULE_NOT_FOUND") {
      console.info(`\nNo ${CONFIG_FILE} found in the package directory.`);
    } else {
      console.warn(`\nFailed to find ${CONFIG_FILE}: `, error.message);
    }
  }

  if (!overrides) {
    console.info(`\nUsing default build config.\n`);
    return DEFAULT_BUILD_CONFIG;
  }

  return { ...DEFAULT_BUILD_CONFIG, ...overrides };
}
