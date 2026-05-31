import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import type { PluginConfigTanstack } from "@jsoc/grid-tanstack-shared";
import { useGridStoreMemo } from "@jsoc/vue-grid";
import type { MaybeRefOrGetter } from "vue";

/**
 * Composable to create a grid store for TanStack Table.
 *
 * Pass reactive props with {@link toRef}, e.g. `useGridStore(toRef(props, "data"))`.
 */
export function useGridStore(
  data: MaybeRefOrGetter<GridData>,
  configGeneratorOptions?: MaybeRefOrGetter<
    PluginConfigGeneratorOptions<PluginConfigTanstack> | undefined
  >,
) {
  return useGridStoreMemo<PluginConfigTanstack>(
    data,
    CONFIG_GENERATOR,
    configGeneratorOptions,
  );
}

const CONFIG_GENERATOR: PluginConfigGenerator<PluginConfigTanstack> = (
  gridSchema,
  options,
) => {
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    data: gridSchema.rows,
    columns,
    getRowId: (row) => getRowIdString(row, gridSchema.primaryColumnKey),
  };
};
