import type { GridPlugin } from "#config-generators/configGenerator.registry.ts";

import { createContext } from "react";

export type PluginContextValue = GridPlugin;

export const PluginContext = createContext<PluginContextValue | undefined>(
  undefined,
);
