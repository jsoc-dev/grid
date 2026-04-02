import { COLUMN_GENERATOR_BY_TYPE_AG } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type GridRow,
  type GridRowId,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";

export type ColDefAg = ColDef<GridRow>;
export type PluginConfigAg = Pick<
  AgGridReactProps<GridRow>,
  "rowData" | "columnDefs" | "getRowId"
> &
  PluginConfig<ColDefAg>;

export const configGeneratorAg: PluginConfigGenerator<PluginConfigAg> = (
  gridSchema,
  options,
) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columnDefs = generateColumns<PluginConfigAg>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_AG,
    options?.customColumnGeneratorByType,
  );

  return {
    columnDefs,
    getRowId: ({ data }) => String(data[primaryColumnKey] as GridRowId),
    rowData: rows,
  };
};
