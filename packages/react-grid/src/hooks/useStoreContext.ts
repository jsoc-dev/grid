import {
  StoreContext,
  type StoreContextValue,
} from "#contexts/StoreContext.tsx";
import { ReactGridError } from "#errors/ReactGridError.ts";

import type { PluginConfig } from "@jsoc/grid-core";
import { useContext } from "react";

export function useStoreContext<
  TConfig extends PluginConfig,
>(): StoreContextValue<TConfig> {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new ReactGridError(`Missing provider for useStoreContext`);
  }

  return ctx as StoreContextValue<TConfig>;
}
