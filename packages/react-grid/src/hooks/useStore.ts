import {
  CONFIG_GENERATOR_BY_PLUGIN,
  type ConfigByPlugin,
  type GridPlugin,
} from "#config-generators/configGenerator.registry.ts";
import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridData,
  type GridStore,
  newGridStore,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { shallowEqual } from "@jsoc/utils";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";

export type StoreOptions<P extends GridPlugin> = {
  data: GridData;
  plugin: P;
  pluginConfigGeneratorOptions?: PluginConfigGeneratorOptions<
    ConfigByPlugin[P]
  >;
  name?: string;
};

/**
 * Hook to create and use a grid store.
 * - Provide the result of this hook to the `StoreContextProvider` component in your app.
 * - To avoid unnecessary re-renders, provide the hook result without destructuring and recreating.
 */
export function useStore<P extends GridPlugin>(
  options: StoreOptions<P>,
): StoreContextValue<P> {
  const lastUpdateOptionsRef = useRef<StoreOptions<P> | null>(null);

  const [gridStore, setGridStore] = useState(() =>
    updateStore(lastUpdateOptionsRef, options),
  );

  // update grid store when options fields shallowly change.
  useEffect(() => {
    const shouldUpdate =
      !lastUpdateOptionsRef.current ||
      !shallowEqual(options, lastUpdateOptionsRef.current);
    if (shouldUpdate) {
      const store = updateStore(lastUpdateOptionsRef, options);
      setGridStore(store);
    }
  }, [options]);

  // prepare the store context value
  const storeContextValue = useMemo(
    () => ({
      gridStore,
      setGridStore,
      plugin: options.plugin,
    }),
    [gridStore, setGridStore, options.plugin],
  );

  return storeContextValue;
}

function updateStore<P extends GridPlugin>(
  commitRef: RefObject<StoreOptions<P> | null>,
  options: StoreOptions<P>,
): GridStore<ConfigByPlugin[P]> {
  const { plugin, pluginConfigGeneratorOptions, ...gridOptions } = options;

  const params = {
    gridOptions,
    pluginOptions: {
      configGenerator: CONFIG_GENERATOR_BY_PLUGIN[plugin],
      configGeneratorOptions: pluginConfigGeneratorOptions,
    },
  };

  const gridStore = newGridStore(params.gridOptions, params.pluginOptions);
  commitRef.current = options;

  return gridStore;
}
