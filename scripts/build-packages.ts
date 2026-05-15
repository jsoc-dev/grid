import { REPO_DIR } from "#/repo.ts";
import { getPackageJson } from "#/scripts/utils/getPackageJson.ts";
import { logMilestone } from "#/scripts/utils/logMilestone.ts";

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { build, type UserConfig } from "tsdown";

type BuildConfig = UserConfig;

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

const CWD = process.cwd();
const INIT_CWD = process.env.INIT_CWD;

await main();

async function main() {
  const packageDir = [INIT_CWD, CWD].find((dir) => dir && dir !== REPO_DIR);

  if (packageDir) {
    await buildPackage(packageDir);
    return;
  }

  // TODO: Build all packages
  console.log("Building all packages is currently not supported.");
}

async function buildPackage(packageDir: string) {
  try {
    const packageJson = getPackageJson(packageDir);

    if (!packageJson) {
      throw new Error(`No package.json found in ${packageDir}`);
    }

    logMilestone(`📦 Build started for "${packageJson.name}"`, "start");
    console.log("\nPackage directory:", packageDir);
    const config = await getBuildConfig(packageDir);
    process.chdir(packageDir);
    await build(config);
    process.chdir(CWD);
    logMilestone(`✅ Build completed for "${packageJson.name}"`, "end");
  } catch (error) {
    console.error(`❌ Failed to build package. ${error}`);
    process.exit(1);
  }
}

async function getBuildConfig(packageDir: string): Promise<BuildConfig> {
  const CONFIG_FILENAME = "tsdown.config.ts";

  try {
    const configPath = resolve(packageDir, CONFIG_FILENAME);
    const configModuleUrl = pathToFileURL(configPath).href;
    const configModule = await import(configModuleUrl);
    const overrides = configModule.default;
    console.info(`\nFound ${CONFIG_FILENAME} at ${configPath}.\n`);

    return {
      ...DEFAULT_BUILD_CONFIG,
      ...overrides,
    };
  } catch {
    console.info(
      `\nUnable to find ${CONFIG_FILENAME}. Default build config will be used.\n`,
    );

    return DEFAULT_BUILD_CONFIG;
  }
}
