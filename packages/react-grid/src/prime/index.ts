export * from "#config-generators/column-generators/columnGeneratorsPrime.tsx";
export * from "#config-generators/configGeneratorPrime.ts";
export * from "#prime/types.ts";

import { configGeneratorPrime } from "#config-generators/configGeneratorPrime.ts";
import { type StoreOptions, useStore, useStoreContext } from "#hooks/index.ts";
import type { PluginConfigPrime } from "#prime/types.ts";

export function usePrimeStore(
  options: Omit<StoreOptions<PluginConfigPrime>, "generator" | "pluginId">,
) {
  return useStore({
    ...options,
    pluginId: "prime",
    generator: configGeneratorPrime,
  });
}

export function usePrimeStoreContext() {
  return useStoreContext<PluginConfigPrime>();
}
