import { COLUMN_GENERATOR_BY_TYPE_TANSTACK } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type GridRowId,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { ColumnDef, TableOptions } from "@tanstack/react-table";

export type ColDefTanstack = ColumnDef<GridRow>;

export type PluginConfigTanstack = Pick<
  TableOptions<GridRow>,
  "columns" | "data" | "getRowId"
> &
  PluginConfig<ColDefTanstack>;

export const configGeneratorTanstack: PluginConfigGenerator<
  PluginConfigTanstack
> = (gridSchema, options) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns<PluginConfigTanstack>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_TANSTACK,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    data: rows,
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
  };
};
