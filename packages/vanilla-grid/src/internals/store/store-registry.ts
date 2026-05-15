import type { GridStore, GridStoreId, PluginConfig } from "@jsoc/grid-core";

/**
 * Registry of GridStores.
 */
export type GridStoreRegistry = Map<GridStoreId, GridStore>;

export const GRID_STORE_REGISTRY: GridStoreRegistry = new Map();

export function findGridStoreById<C extends PluginConfig>(
  storeId: GridStoreId,
) {
  return GRID_STORE_REGISTRY.get(storeId) as GridStore<C> | undefined;
}
