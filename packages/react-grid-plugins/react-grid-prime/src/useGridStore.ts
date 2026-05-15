import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.tsx";
import type { PluginConfigPrime } from "#types.ts";

import {
  generateColumns,
  type GridData,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import { useGridStoreMemo } from "@jsoc/react-grid";

export function useGridStore(
  data: GridData,
  configGeneratorOptions?: PluginConfigGeneratorOptions<PluginConfigPrime>,
) {
  return useGridStoreMemo<PluginConfigPrime>(
    data,
    configGenerator,
    configGeneratorOptions,
  );
}

const configGenerator: PluginConfigGenerator<PluginConfigPrime> = (
  gridSchema,
  options,
) => {
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    value: gridSchema.rows,
    columns,
  };
};
