import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.tsx";
import type { PluginConfigMantine } from "#types.ts";

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
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigMantine>,
) {
  return useGridStoreMemo<PluginConfigMantine>(
    data,
    CONFIG_GENERATOR,
    configGeneratorOptions,
  );
}

const CONFIG_GENERATOR: PluginConfigGenerator<PluginConfigMantine> = (
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
    data: gridSchema.rows,
    getRowId: (row) => getRowIdString(row, gridSchema.primaryColumnKey),
  };
};
