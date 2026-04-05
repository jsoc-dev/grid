import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type StoreContextValue<TConfig extends PluginConfig = PluginConfig> = {
  gridStore: GridStore<TConfig>;
  pluginId: string;
  setGridStore: Dispatch<SetStateAction<GridStore<TConfig>>>;
};

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined,
);
