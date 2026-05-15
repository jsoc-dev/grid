import { VanillaGridError } from "#internals/errors/VanillaGridError.ts";
import { findGridStoreById } from "#internals/store/store-registry.ts";

import type { GridStore, GridStoreId, PluginConfig } from "@jsoc/grid-core";

export function getGridStore<C extends PluginConfig = PluginConfig>(
  storeId: GridStoreId,
): GridStore<C> {
  const gridStore = findGridStoreById<C>(storeId);

  if (!gridStore) {
    throw new VanillaGridError(`No grid store found by ID: ${storeId}`);
  }

  return gridStore;
}
