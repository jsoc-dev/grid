import { COLUMN_GENERATOR_BY_TYPE_AG } from "#config-generators/column-generators/index.ts";

import {
  generateColumns,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { SubsetKeysOf } from "@jsoc/utils";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";

export type PluginConfigNamesAg = SubsetKeysOf<
  AgGridReactProps,
  "rowData" | "columnDefs" | "getRowId"
>;
export type PluginConfigAg = Pick<AgGridReactProps, PluginConfigNamesAg> &
  PluginConfig<ColDef>;

export type PluginPropsAg = Omit<AgGridReactProps, PluginConfigNamesAg>;

export const configGeneratorAg: PluginConfigGenerator<PluginConfigAg> = (
  gridSchema,
  options,
) => {
  const columnDefs = generateColumns<PluginConfigAg>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_AG,
    options?.customColumnGeneratorByType,
  );

  return {
    columnDefs,
    getRowId: ({ data }) => data[gridSchema.meta.primaryColumnKey],
    rowData: gridSchema.meta.rows,
  };
};
