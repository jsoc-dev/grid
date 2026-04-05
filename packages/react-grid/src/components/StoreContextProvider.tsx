import {
  StoreContext,
  type StoreContextValue,
} from "#contexts/StoreContext.tsx";

import type { PluginConfig } from "@jsoc/grid-core";
import type { ReactNode } from "react";

export type StoreContextProviderProps<
  TConfig extends PluginConfig = PluginConfig,
> = {
  value: StoreContextValue<TConfig>;
  children: ReactNode;
};

export function StoreContextProvider<
  TConfig extends PluginConfig = PluginConfig,
>({ value, children }: StoreContextProviderProps<TConfig>) {
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
