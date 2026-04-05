import type { StoreContextValue } from "#contexts/StoreContext.tsx";

import {
  type GridData,
  type GridStore,
  newGridStore,
  type PluginConfig,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { shallowEqual } from "@jsoc/utils";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";

export type StoreOptions<TConfig extends PluginConfig> = {
  data: GridData;
  pluginId: string;
  generator: PluginConfigGenerator<TConfig>;
  generatorOptions?: PluginConfigGeneratorOptions<TConfig>;
  name?: string;
};

/**
 * Hook to create and use a grid store.
 * - Provide the result of this hook to the `StoreContextProvider` component in your app.
 * - To avoid unnecessary re-renders, provide the hook result without destructuring and recreating.
 */
export function useStore<TConfig extends PluginConfig>(
  options: StoreOptions<TConfig>,
): StoreContextValue<TConfig> {
  const lastUpdateOptionsRef = useRef<StoreOptions<TConfig> | null>(null);

  const [gridStore, setGridStore] = useState(() =>
    createStore(lastUpdateOptionsRef, options),
  );

  // update grid store when options fields shallowly change.
  useEffect(() => {
    const shouldUpdate =
      !lastUpdateOptionsRef.current ||
      !shallowEqual(options, lastUpdateOptionsRef.current);
    if (shouldUpdate) {
      const store = createStore(lastUpdateOptionsRef, options);
      setGridStore(store);
    }
  }, [options]);

  // prepare the store context value
  const storeContextValue = useMemo(
    () => ({
      gridStore,
      setGridStore,
      pluginId: options.pluginId,
    }),
    [gridStore, setGridStore, options.pluginId],
  );

  return storeContextValue;
}

function createStore<TConfig extends PluginConfig>(
  commitRef: RefObject<StoreOptions<TConfig> | null>,
  options: StoreOptions<TConfig>,
): GridStore<TConfig> {
  const { generator, generatorOptions, ...gridOptions } = options;

  const params = {
    gridOptions,
    pluginOptions: {
      configGenerator: generator as PluginConfigGenerator<unknown>,
      configGeneratorOptions: generatorOptions,
    },
  };

  const gridStore = newGridStore(
    params.gridOptions,
    params.pluginOptions,
  ) as GridStore<TConfig>;
  commitRef.current = options;

  return gridStore;
}
