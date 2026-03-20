import { COLUMN_GENERATOR_BY_TYPE_AG } from "#config-generators/ag/columnGeneratorsAg.tsx";
import {
  type PluginConfig,
  type PluginConfigGenerator,
  generateColumns,
} from "@jsoc/grid-core";
import { SubsetKeysOf } from "@jsoc/utils";
import { type AgGridReactProps } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";

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
