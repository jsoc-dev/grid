import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { createContext } from "react";

export const GridStoreContext = createContext<
  GridStore<PluginConfig> | undefined
>(undefined);
