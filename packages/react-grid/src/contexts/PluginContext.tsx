import type { GridPlugin } from "#constants/plugins.ts";

import { createContext } from "react";

export type PluginContextValue = GridPlugin;

export const PluginContext = createContext<PluginContextValue | undefined>(
  undefined,
);
