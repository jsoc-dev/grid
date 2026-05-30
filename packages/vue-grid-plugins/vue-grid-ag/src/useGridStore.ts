import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";
import type { PluginConfigAg } from "#types.ts";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useGridStoreMemo } from "@jsoc/vue-grid";
import type { MaybeRefOrGetter } from "vue";

/**
 * Composable to create a grid store for AG Grid.
 *
 * Pass reactive props with {@link toRef}, e.g. `useGridStore(toRef(props, "data"))`.
 */
export function useGridStore(
  data: MaybeRefOrGetter<GridData>,
  configGeneratorOptions?: MaybeRefOrGetter<
    PluginConfigGeneratorOptions<PluginConfigAg> | undefined
  >,
) {
  return useGridStoreMemo<PluginConfigAg>(
    data,
    CONFIG_GENERATOR,
    configGeneratorOptions,
  );
}

const CONFIG_GENERATOR: PluginConfigGenerator<PluginConfigAg> = (
  gridSchema,
  options,
) => {
  const columnDefs = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    rowData: gridSchema.rows,
    columnDefs,
    getRowId: ({ data }) => getRowIdString(data, gridSchema.primaryColumnKey),
  };
};
