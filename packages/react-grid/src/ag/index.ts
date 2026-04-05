export * from "#ag/types.ts";
export * from "#config-generators/column-generators/columnGeneratorsAg.tsx";
export * from "#config-generators/configGeneratorAg.ts";

import type { PluginConfigAg } from "#ag/types.ts";
import { configGeneratorAg } from "#config-generators/configGeneratorAg.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";

export function useAgStore(
  options: Omit<StoreOptions<PluginConfigAg>, "generator" | "pluginId">,
) {
  return useStore({ ...options, pluginId: "ag", generator: configGeneratorAg });
}

export function useAgStoreContext() {
  return useStoreContext<PluginConfigAg>();
}
