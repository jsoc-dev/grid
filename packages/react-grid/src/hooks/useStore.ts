import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
} from "#config-generators/configGenerator.registry.ts";
import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridOptions,
  newGridStore,
  type PluginConfig,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
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
) => useStore(options, CONFIG_GENERATOR_BY_PLUGIN.ag, configGeneratorOptions);

/**
 * Hook to create and use store specifically for GridPlugin "mui".
 */
export const useStoreMui: PluginSpecificUseStore<ConfigByPlugin["mui"]> = (
  options,
  configGeneratorOptions,
) => useStore(options, CONFIG_GENERATOR_BY_PLUGIN.mui, configGeneratorOptions);

/**
 * Generic hook to create and use a grid store.
 */
export function useStore<C extends PluginConfig>(
  gridOptions: GridOptions,
  configGenerator: PluginConfigGenerator<C>,
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>,
) {
  const [gridStore, setGridStore] = useState(() =>
    newGridStore<C>(gridOptions, configGenerator, configGeneratorOptions),
  );

  useEffect(() => {
    setGridStore(
      newGridStore<C>(gridOptions, configGenerator, configGeneratorOptions),
    );
  }, [configGenerator, configGeneratorOptions, gridOptions]);

  return {
    gridStore,
    setGridStore,
  };
}
