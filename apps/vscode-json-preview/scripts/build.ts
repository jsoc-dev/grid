import { getExtensionConfig } from "#ext/esbuild.config.ts";
import { getWebviewConfig } from "#ui/esbuild.config.ts";

import { context } from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const configOptions = { production };

async function main() {
  const extensionCtx = await context(getExtensionConfig(configOptions));
  const webviewCtx = await context(getWebviewConfig(configOptions));

  if (watch) {
    await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
    console.info("[watch] esbuild started");
    return;
  }

  await Promise.all([extensionCtx.rebuild(), webviewCtx.rebuild()]);
  await extensionCtx.dispose();
  await webviewCtx.dispose();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
