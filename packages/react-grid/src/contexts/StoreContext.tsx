import type { ConfigByPlugin, GridPlugin } from "#config-generators/index.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type StoreContextValue<C extends PluginConfig> = {
  gridStore: GridStore<C>;
  setGridStore: Dispatch<SetStateAction<GridStore<C>>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StoreContext = createStoreContext<any>();
export const StoreContextAg = createStoreContext<ConfigByPlugin["ag"]>("ag");
export const StoreContextMui = createStoreContext<ConfigByPlugin["mui"]>("mui");

function createStoreContext<C extends PluginConfig>(plugin?: GridPlugin) {
  const StoreContext = createContext<StoreContextValue<C> | undefined>(
    undefined,
  );

  StoreContext.displayName = `StoreContext${plugin ? `(${plugin})` : ""}`;

  return StoreContext;
}
