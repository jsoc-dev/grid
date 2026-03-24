import {
  PluginContext,
  type PluginContextValue,
} from "#contexts/PluginContext.tsx";
import { ReactGridError } from "#errors/ReactGridError.ts";

import { useContext } from "react";

export function usePluginContext(): PluginContextValue {
  const ctx = useContext(PluginContext);

  if (!ctx) {
    throw new ReactGridError(`Missing provider for usePluginContext`);
  }

  return ctx;
}
