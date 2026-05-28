import { useShallowStable } from "#internals/hooks/useShallowStable.ts";

import {
  BaseGridStore,
  type GridData,
  type GridStore,
  type PluginConfig,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useMemo } from "react";

/**
 * Creates a new {@link GridStore} for the given grid options and configuration generator.
 * If the new grid options or config generator options are shallowly equal to the previously
 * provided ones, the same memoized store instance will be returned.
 *
 * @template C - Type of the Grid plugin configuration
 * @param data data for the grid store.
 * @param configGenerator config generator to use for the grid store.
 * @param configGeneratorOptions config generator options to use for the grid store.
 * @returns Instance of {@link GridStore<C>}.
 */
export function useGridStoreMemo<C extends PluginConfig>(
  data: GridData,
  configGenerator: PluginConfigGenerator<C>,
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>,
): GridStore<C> {
  configGeneratorOptions = useShallowStable(configGeneratorOptions);

  return useMemo(
    () =>
      new BaseGridStore({
        data,
        configGenerator,
        configGeneratorOptions,
      }),
    [configGenerator, data, configGeneratorOptions],
  );
}
