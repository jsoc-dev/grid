export * from "#config-generators/column-generators/columnGeneratorsTanstack.tsx";
export * from "#config-generators/configGeneratorTanstack.ts";
export * from "#tanstack/types.ts";

import { configGeneratorTanstack } from "#config-generators/configGeneratorTanstack.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";
import type { PluginConfigTanstack } from "#tanstack/types.ts";

export function useTanstackStore(
  options: Omit<StoreOptions<PluginConfigTanstack>, "generator" | "pluginId">,
) {
  return useStore({
    ...options,
    pluginId: "tanstack",
    generator: configGeneratorTanstack,
  });
}

export function useTanstackStoreContext() {
  return useStoreContext<PluginConfigTanstack>();
}
