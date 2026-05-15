import { GridStoreContext } from "#internals/contexts/GridStoreContext.tsx";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import type { ReactNode } from "react";

export type GridStoreProviderProps<C extends PluginConfig> = {
  value: GridStore<C>;
  children: ReactNode;
};

export function GridStoreProvider<C extends PluginConfig>({
  value,
  children,
}: GridStoreProviderProps<C>) {
  return (
    <GridStoreContext.Provider value={value as GridStore}>
      {children}
    </GridStoreContext.Provider>
  );
}
