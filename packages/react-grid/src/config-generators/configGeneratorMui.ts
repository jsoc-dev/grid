import { COLUMN_GENERATOR_BY_TYPE_MUI } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { SubsetKeysOf } from "@jsoc/utils";
import type { DataGridProps, GridColDef } from "@mui/x-data-grid";

export type PluginConfigNamesMui = SubsetKeysOf<
  DataGridProps,
  "rows" | "columns" | "getRowId"
>;
export type PluginConfigMui = Pick<DataGridProps, PluginConfigNamesMui> &
  PluginConfig<GridColDef>;

export const configGeneratorMui: PluginConfigGenerator<PluginConfigMui> = (
  gridSchema,
  options,
) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns<PluginConfigMui>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_MUI,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    getRowId: (row) => row[primaryColumnKey],
    rows,
  };
};
