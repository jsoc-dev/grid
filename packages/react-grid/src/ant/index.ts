export * from "#ant/types.ts";
export * from "#config-generators/column-generators/columnGeneratorsAnt.tsx";
export * from "#config-generators/configGeneratorAnt.ts";

import type { PluginConfigAnt } from "#ant/types.ts";
import { configGeneratorAnt } from "#config-generators/configGeneratorAnt.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";

export function useAntStore(
  options: Omit<StoreOptions<PluginConfigAnt>, "generator" | "pluginId">,
) {
  return useStore({
    ...options,
    pluginId: "ant",
    generator: configGeneratorAnt,
  });
}

export function useAntStoreContext() {
  return useStoreContext<PluginConfigAnt>();
}
