export * from "#config-generators/column-generators/columnGeneratorsMantine.tsx";
export * from "#config-generators/configGeneratorMantine.ts";
export * from "#mantine/types.ts";

import { configGeneratorMantine } from "#config-generators/configGeneratorMantine.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";
import type { PluginConfigMantine } from "#mantine/types.ts";

export function useMantineStore(
  options: Omit<StoreOptions<PluginConfigMantine>, "generator" | "pluginId">,
) {
  return useStore({
    ...options,
    pluginId: "mantine",
    generator: configGeneratorMantine,
  });
}

export function useMantineStoreContext() {
  return useStoreContext<PluginConfigMantine>();
}
