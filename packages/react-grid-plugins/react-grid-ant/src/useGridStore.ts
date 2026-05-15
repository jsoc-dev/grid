import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.tsx";
import type { PluginConfigAnt } from "#types.ts";

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
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigAnt>,
) {
  return useGridStoreMemo<PluginConfigAnt>(
    data,
    CONFIG_GENERATOR,
    configGeneratorOptions,
  );
}

const CONFIG_GENERATOR: PluginConfigGenerator<PluginConfigAnt> = (
  gridSchema,
  options,
) => {
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    dataSource: gridSchema.rows,
    rowKey: (row) => getRowIdString(row, gridSchema.primaryColumnKey),
  };
};
