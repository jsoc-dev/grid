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

export const StoreContextAg = createContext<
  StoreContextValue<"ag"> | undefined
>(undefined);

export const StoreContextMui = createContext<
  StoreContextValue<"mui"> | undefined
>(undefined);

export const StoreContextTanstack = createContext<
  StoreContextValue<"tanstack"> | undefined
>(undefined);

export const StoreContextMantine = createContext<
  StoreContextValue<"mantine"> | undefined
>(undefined);

// https://chatgpt.com/share/69c2542a-d4a4-800c-8566-8dd49ca6623f
export const STORE_CONTEXT_BY_PLUGIN: {
  [P in GridPlugin]: Context<StoreContextValue<P> | undefined>;
} = {
  ag: StoreContextAg,
  mui: StoreContextMui,
  tanstack: StoreContextTanstack,
  mantine: StoreContextMantine,
} as const;
