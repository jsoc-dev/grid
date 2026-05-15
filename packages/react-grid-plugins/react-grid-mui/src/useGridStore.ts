import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.tsx";
import type { PluginConfigMui } from "#types.ts";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useGridStoreMemo } from "@jsoc/react-grid";

export function useGridStore(
  data: GridData,
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigMui>,
) {
  return useGridStoreMemo<PluginConfigMui>(
    data,
    CONFIG_GENERATOR,
    configGeneratorOptions,
  );
}

const CONFIG_GENERATOR: PluginConfigGenerator<PluginConfigMui> = (
  gridSchema,
  options,
) => {
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    rows: gridSchema.rows,
    columns,
    getRowId: (row) => getRowIdString(row, gridSchema.primaryColumnKey),
  };
};
