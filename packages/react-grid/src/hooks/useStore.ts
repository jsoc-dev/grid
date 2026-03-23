import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
  type GridPlugin,
} from "#config-generators/configGenerator.registry.ts";
import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridData,
  newGridStore,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook to create and use a grid store.
 * - Make sure the arguments are stable, otherwise it will lead to infinite renders.
 * - Provide the result of this hook to the `StoreContextProvider` component in your app.
 * - To avoid unnecessary re-renders, provide the hook result without destructuring and recreating.
 */
export function useStore<P extends GridPlugin>(
  data: GridData,
  plugin: P,
  pluginConfigGeneratorOptions?: PluginConfigGeneratorOptions<
    ConfigByPlugin[P]
  >,
  name?: string,
): StoreContextValue<P> {
  const gridOptions = useMemo(
    () => ({
      data,
      name,
    }),
    [data, name],
  );

  const pluginOptions = useMemo(
    () => ({
      configGenerator: CONFIG_GENERATOR_BY_PLUGIN[plugin],
      configGeneratorOptions: pluginConfigGeneratorOptions,
    }),
    [plugin, pluginConfigGeneratorOptions],
  );

  // create grid store
  const [gridStore, setGridStore] = useState(() =>
    newGridStore(gridOptions, pluginOptions),
  );

  // update grid store when grid options or plugin options change
  useEffect(() => {
    setGridStore(newGridStore(gridOptions, pluginOptions));
  }, [gridOptions, pluginOptions]);

  // prepare the store context value
  const storeContextValue = useMemo(
    () => ({
      gridStore,
      setGridStore,
      plugin,
    }),
    [gridStore, setGridStore, plugin],
  );

  return storeContextValue;
}
