import type {
  ColumnGenerator,
  GridRow,
  PluginConfig,
  PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";

export type ColDefAg = ColDef<GridRow>;

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<AgGridReactProps<GridRow>, "rowData" | "columnDefs" | "getRowId">;

export type ConfigGeneratorAg = PluginConfigGenerator<PluginConfigAg>;
export type ColumnGeneratorAg = ColumnGenerator<PluginConfigAg>;
