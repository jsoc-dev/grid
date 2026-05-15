import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.tsx";

import {
  generateColumns,
  getRowIdString,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import type { PluginConfigTanstack } from "@jsoc/grid-tanstack-shared";
import { useGridStoreMemo } from "@jsoc/react-grid";

export function useGridStore(
  data: GridData,
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigTanstack>,
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
