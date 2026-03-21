import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
} from "#config-generators/configGenerator.registry.ts";
import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridOptions,
  newGridStore,
  type PluginConfig,
  type PluginConfigGeneratorOptions,
  type PluginOptions,
} from "@jsoc/grid-core";
import { useEffect, useState } from "react";

export type PluginSpecificUseStore<C extends PluginConfig> = (
  options: GridOptions,
  configGeneratorOptions: PluginConfigGeneratorOptions<C>,
) => StoreContextValue<C>;

/**
 * Hook to create and use store specifically for GridPlugin "ag".
 */
export const useStoreAg: PluginSpecificUseStore<ConfigByPlugin["ag"]> = (
  options,
  configGeneratorOptions,
) =>
  useStore(options, {
    configGenerator: CONFIG_GENERATOR_BY_PLUGIN.ag,
    configGeneratorOptions,
  });

/**
 * Hook to create and use store specifically for GridPlugin "mui".
 */
export const useStoreMui: PluginSpecificUseStore<ConfigByPlugin["mui"]> = (
  options,
  configGeneratorOptions,
) =>
  useStore(options, {
    configGenerator: CONFIG_GENERATOR_BY_PLUGIN.mui,
    configGeneratorOptions,
  });

/**
 * Hook to create and use store specifically for GridPlugin "tanstack".
 */
export const useStoreTanstack: PluginSpecificUseStore<
  ConfigByPlugin["tanstack"]
> = (options, configGeneratorOptions) =>
  useStore(options, {
    configGenerator: CONFIG_GENERATOR_BY_PLUGIN.tanstack,
    configGeneratorOptions,
  });

/**
 * Generic hook to create and use a grid store.
 */
export function useStore<C extends PluginConfig>(
  gridOptions: GridOptions,
  pluginOptions: PluginOptions<C>,
) {
  const [gridStore, setGridStore] = useState(() =>
    newGridStore<C>(gridOptions, pluginOptions),
  );

  useEffect(() => {
    setGridStore(newGridStore<C>(gridOptions, pluginOptions));
  }, [gridOptions, pluginOptions]);

  return {
    gridStore,
    setGridStore,
  };
}
