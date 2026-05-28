import { VanillaGridStore } from "#internals/store/VanillaGridStore.ts";

import type {
  GridStore,
  GridStoreOptions,
  PluginConfig,
} from "@jsoc/grid-core";

export function createGridStoreCore<C extends PluginConfig>(
  options: GridStoreOptions<C>,
): GridStore<C> {
  return new VanillaGridStore(options);
}
