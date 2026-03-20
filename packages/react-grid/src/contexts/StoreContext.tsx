import {
  type GridPlugin,
  type ConfigByPlugin,
} from "#config-generators/index.ts";
import { type GridStore, type PluginConfig } from "@jsoc/grid-core";
import { type Dispatch, type SetStateAction, createContext } from "react";

export type StoreContextValue<C extends PluginConfig> = {
  gridStore: GridStore<C>;
  setGridStore: Dispatch<SetStateAction<GridStore<C>>>;
};

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
