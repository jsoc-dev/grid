import { GRID_STORE_REGISTRY } from "#internals/store/store-registry.ts";

import {
  BaseGridStore,
  type GridData,
  type GridStore,
  type PluginConfig,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";

/**
 * Creates a new {@link GridStore} for the given grid options and configuration generator.
 */
export function createGridStoreCore<C extends PluginConfig>(
  data: GridData,
  configGenerator: PluginConfigGenerator<C>,
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>,
): GridStore<C> {
  const store = new BaseGridStore(data, {
    configGenerator,
    configGeneratorOptions,
  });

  GRID_STORE_REGISTRY.set(store.id, store);

  return store;
}
