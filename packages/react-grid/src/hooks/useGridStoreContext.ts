import { GridStoreContext } from "#internals/contexts/GridStoreContext.tsx";
import { ReactGridError } from "#internals/ReactGridError.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { useContext } from "react";

export function useGridStoreContext<
  C extends PluginConfig = PluginConfig,
>(): GridStore<C> {
  const gridStore = useContext(GridStoreContext);

  if (!gridStore) {
    throw new ReactGridError(
      `GridStore not found. Did you forget to add <GridStoreProvider> as a parent component?`,
    );
  }

  return gridStore as GridStore<C>;
}
