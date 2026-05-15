import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";
import type { PluginConfigAg } from "#types.ts";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { createGridStore as createGridStoreCore } from "@jsoc/vanilla-grid";

/**
 * Creates a grid store with the given options.
 */
export function createGridStore(
  data: GridData,
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigAg>,
) {
  return createGridStoreCore(data, CONFIG_GENERATOR, configGeneratorOptions);
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
