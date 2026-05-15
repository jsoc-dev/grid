import { gridStoreInjectionKey } from "#internals/injection.ts";
import { VueGridError } from "#internals/VueGridError.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { inject, type MaybeRef,unref } from "vue";

export function useGridStoreContext<
  C extends PluginConfig = PluginConfig,
>(): GridStore<C> {
  const gridStore = inject(
    gridStoreInjectionKey,
  ) as MaybeRef<GridStore<C>> | undefined;

  if (!gridStore) {
    throw new VueGridError(
      "GridStore not found. Did you forget to add <GridStoreProvider> as a parent component?",
    );
  }

  return unref(gridStore);
}
