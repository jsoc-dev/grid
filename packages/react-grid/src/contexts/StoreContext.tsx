import { GRID_PLUGIN_LIST, type GridPlugin } from "#constants/plugins.ts";
import type { ConfigByPlugin } from "#types/plugin-config.ts";

import type { GridStore } from "@jsoc/grid-core";
import {
  type Context,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type StoreContextValue<P extends GridPlugin> = {
  gridStore: GridStore<ConfigByPlugin[P]>;
  plugin: P;
  setGridStore: Dispatch<SetStateAction<GridStore<ConfigByPlugin[P]>>>;
};

// https://chatgpt.com/share/69ca7cff-42cc-8320-b820-a7dc40525e94
// https://chatgpt.com/share/69c2542a-d4a4-800c-8566-8dd49ca6623f
function createStoreContexts<const P extends readonly GridPlugin[]>(
  plugins: P,
) {
  return Object.fromEntries(
    plugins.map((p) => [
      p,
      createContext<StoreContextValue<typeof p> | undefined>(undefined),
    ]),
  ) as {
    [K in P[number]]: Context<StoreContextValue<K> | undefined>;
  };
}

export const STORE_CONTEXT_BY_PLUGIN = createStoreContexts(GRID_PLUGIN_LIST);
