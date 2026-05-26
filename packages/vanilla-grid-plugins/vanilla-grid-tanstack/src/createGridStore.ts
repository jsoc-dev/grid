import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import type { PluginConfigTanstack } from "@jsoc/grid-tanstack-shared";
import { createGridStoreCore } from "@jsoc/vanilla-grid";

/**
 * Creates a grid store with the given options.
 */
export function createGridStore(
  data: GridData,
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigTanstack>,
) {
  return createGridStoreCore(data, CONFIG_GENERATOR, configGeneratorOptions);
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
