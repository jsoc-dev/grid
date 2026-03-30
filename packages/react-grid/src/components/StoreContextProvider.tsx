import type { GridPlugin } from "#constants/plugins.ts";
import { PluginContext } from "#contexts/PluginContext.tsx";
import {
  STORE_CONTEXT_BY_PLUGIN,
  type StoreContextValue,
} from "#contexts/StoreContext.tsx";

import type { ReactNode } from "react";

export type StoreContextProviderProps<P extends GridPlugin> = {
  value: StoreContextValue<P>;
  children: ReactNode;
};

export function StoreContextProvider<P extends GridPlugin>({
  value,
  children,
}: StoreContextProviderProps<P>) {
  const { plugin } = value;
  const StoreContext = STORE_CONTEXT_BY_PLUGIN[plugin];

  return (
    <StoreContext.Provider value={value}>
      <PluginContext.Provider value={plugin}>{children}</PluginContext.Provider>
    </StoreContext.Provider>
  );
}
