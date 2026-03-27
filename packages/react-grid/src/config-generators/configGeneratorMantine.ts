import { COLUMN_GENERATOR_BY_TYPE_MANTINE } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type GridRowId,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { MRT_ColumnDef, MRT_TableOptions } from "mantine-react-table";

export type ColDefMantine = MRT_ColumnDef<GridRow>;
export type PluginConfigMantine = Pick<
  MRT_TableOptions<GridRow>,
  "columns" | "data" | "getRowId"
> &
  PluginConfig<ColDefMantine>;

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
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
  };
};
