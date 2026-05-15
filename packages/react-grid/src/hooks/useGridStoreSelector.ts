import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { useSyncExternalStore } from "react";

export function useGridStoreSelector<C extends PluginConfig, T>(
  gridStore: GridStore<C>,
  selector: (gridStore: GridStore<C>) => T,
): T {
  return useSyncExternalStore(
    (listener) => gridStore.subscribe(listener),
    () => selector(gridStore),
  );
}
