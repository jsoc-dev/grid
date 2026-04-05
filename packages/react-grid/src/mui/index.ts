export * from "#config-generators/column-generators/columnGeneratorsMui.tsx";
export * from "#config-generators/configGeneratorMui.ts";
export * from "#mui/types.ts";

import { configGeneratorMui } from "#config-generators/configGeneratorMui.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";
import type { PluginConfigMui } from "#mui/types.ts";

export function useMuiStore(
  options: Omit<StoreOptions<PluginConfigMui>, "generator" | "pluginId">,
) {
  return useStore({
    ...options,
    pluginId: "mui",
    generator: configGeneratorMui,
  });
}

export function useMuiStoreContext() {
  return useStoreContext<PluginConfigMui>();
}
