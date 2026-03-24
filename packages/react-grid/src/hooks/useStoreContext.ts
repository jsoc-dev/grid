import type { GridPlugin } from "#config-generators/index.ts";
import {
  STORE_CONTEXT_BY_PLUGIN,
  type StoreContextValue,
} from "#contexts/StoreContext.tsx";
import { ReactGridError } from "#errors/ReactGridError.ts";
import { usePluginContext } from "#hooks/usePluginContext.ts";

import { useContext } from "react";

export function useStoreContext<P extends GridPlugin>(): StoreContextValue<P> {
  const plugin = usePluginContext();
  const ctx = useContext(STORE_CONTEXT_BY_PLUGIN[plugin as P]);

  if (!ctx) {
    throw new ReactGridError(`Missing provider for useStoreContext(${plugin})`);
  }

  return ctx;
}
