import type { GridStore, GridStoreId, PluginConfig } from "@jsoc/grid-core";

/**
 * Registry of GridStores.
 */
export type GridStoreRegistry = Map<GridStoreId, GridStore>;

const GRID_STORE_REGISTRY: GridStoreRegistry = new Map();

export function findGridStoreById<C extends PluginConfig>(
  storeId: GridStoreId,
) {
  return GRID_STORE_REGISTRY.get(storeId) as GridStore<C> | undefined;
}

export function registerGridStore<C extends PluginConfig>(store: GridStore<C>) {
  GRID_STORE_REGISTRY.set(store.id, store as GridStore);
}

export function unregisterGridStore<C extends PluginConfig>(
  store: GridStore<C>,
) {
  GRID_STORE_REGISTRY.delete(store.id);
}
