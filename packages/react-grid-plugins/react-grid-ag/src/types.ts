import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";

export type ColDefAg = ColDef<GridRow>;

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<AgGridReactProps<GridRow>, "rowData" | "columnDefs" | "getRowId">;
