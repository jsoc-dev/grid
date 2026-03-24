import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
  type GridPlugin,
} from "#config-generators/configGenerator.registry.ts";
import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridOptions,
  newGridStore,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook to create and use a grid store.
 */
export function useStore<P extends GridPlugin>(
  gridOptions: GridOptions,
  plugin: P,
  pluginConfigGeneratorOptions?: PluginConfigGeneratorOptions<
    ConfigByPlugin[P]
  >,
): StoreContextValue<P> {
  const pluginOptions = useMemo(
    () => ({
      configGenerator: CONFIG_GENERATOR_BY_PLUGIN[plugin],
      configGeneratorOptions: pluginConfigGeneratorOptions,
    }),
    [plugin, pluginConfigGeneratorOptions],
  );

  const [gridStore, setGridStore] = useState(() =>
    newGridStore(gridOptions, pluginOptions),
  );

  useEffect(() => {
    setGridStore(newGridStore(gridOptions, pluginOptions));
  }, [gridOptions, pluginOptions]);

  const ctx = useMemo(
    () => ({
      gridStore,
      setGridStore,
      plugin,
    }),
    [gridStore, setGridStore, plugin],
  );

  return ctx;
}
