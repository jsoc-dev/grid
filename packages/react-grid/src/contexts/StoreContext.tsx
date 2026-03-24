import type {
  ConfigByPlugin,
  GridPlugin,
} from "#config-generators/configGenerator.registry.ts";

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

/**
 * Creates a store context for a specific plugin.
 * @see {@link https://chatgpt.com/share/69c2542a-d4a4-800c-8566-8dd49ca6623f Design Discussion}
 */
const createStoreContext = <P extends GridPlugin = GridPlugin>(plugin?: P) => {
  const StoreContext = createContext<StoreContextValue<P> | undefined>(
    undefined,
  );
  StoreContext.displayName = `StoreContext(${plugin})`;

  return StoreContext;
};

export const StoreContext = createStoreContext();
export const StoreContextAg = createStoreContext("ag");
export const StoreContextMui = createStoreContext("mui");
export const StoreContextTanstack = createStoreContext("tanstack");
export const StoreContextMantine = createStoreContext("mantine");

export const STORE_CONTEXT_BY_PLUGIN: {
  [P in GridPlugin]: Context<StoreContextValue<P> | undefined>;
} = {
  ag: StoreContextAg,
  mui: StoreContextMui,
  tanstack: StoreContextTanstack,
  mantine: StoreContextMantine,
} as const;
