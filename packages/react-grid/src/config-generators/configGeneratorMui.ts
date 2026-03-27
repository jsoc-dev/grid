import { COLUMN_GENERATOR_BY_TYPE_MUI } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type GridRowId,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { DataGridProps, GridColDef } from "@mui/x-data-grid";

export type ColDefMui = GridColDef<GridRow>;
export type PluginConfigMui = Pick<
  DataGridProps<GridRow>,
  "rows" | "columns" | "getRowId"
> &
  PluginConfig<ColDefMui>;

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
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
    rows,
  };
};
