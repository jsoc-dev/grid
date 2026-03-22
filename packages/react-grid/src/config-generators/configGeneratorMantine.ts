import { COLUMN_GENERATOR_BY_TYPE_MANTINE } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { SubsetKeysOf } from "@jsoc/utils";
import type { MRT_ColumnDef, MRT_TableOptions } from "mantine-react-table";

export type PluginConfigNamesMantine = SubsetKeysOf<
  MRT_TableOptions<GridRow>,
  "columns" | "data" | "getRowId"
>;

export type PluginConfigMantine = Pick<
  MRT_TableOptions<GridRow>,
  PluginConfigNamesMantine
> &
  PluginConfig<MRT_ColumnDef<GridRow>>;

export type PluginPropsMantine = Omit<
  MRT_TableOptions<GridRow>,
  PluginConfigNamesMantine
>;

export const configGeneratorMantine: PluginConfigGenerator<
  PluginConfigMantine
> = (gridSchema, options) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns<PluginConfigMantine>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_MANTINE,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    data: rows,
    getRowId: (row) => String(row[primaryColumnKey]),
  };
};
