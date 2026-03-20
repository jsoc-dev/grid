import { COLUMN_GENERATOR_BY_TYPE_MUI } from "#config-generators/mui/columnGeneratorsMui.tsx";
import {
  type PluginConfig,
  type PluginConfigGenerator,
  generateColumns,
} from "@jsoc/core/grid";
import type { SubsetKeysOf } from "@jsoc/core/utils";
import { type DataGridProps } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

export type PluginConfigNamesMui = SubsetKeysOf<
  DataGridProps,
  "rows" | "columns" | "getRowId"
>;
export type PluginConfigMui = Pick<DataGridProps, PluginConfigNamesMui> &
  PluginConfig<GridColDef>;

export type PluginPropsMui = Omit<DataGridProps, PluginConfigNamesMui>;

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
