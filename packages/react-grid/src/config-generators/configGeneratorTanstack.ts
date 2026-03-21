import { COLUMN_GENERATOR_BY_TYPE_TANSTACK } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { SubsetKeysOf } from "@jsoc/utils";
import type { ColumnDef, TableOptions } from "@tanstack/react-table";

export type PluginConfigNamesTanstack = SubsetKeysOf<
  TableOptions<GridRow>,
  "columns" | "data" | "getRowId"
>;

export type PluginConfigTanstack = Pick<
  TableOptions<GridRow>,
  PluginConfigNamesTanstack
> &
  PluginConfig<ColumnDef<GridRow>>;

export type PluginPropsTanstack = Omit<
  TableOptions<GridRow>,
  PluginConfigNamesTanstack
>;

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
    getRowId: (row) => String(row[primaryColumnKey]),
  };
};
