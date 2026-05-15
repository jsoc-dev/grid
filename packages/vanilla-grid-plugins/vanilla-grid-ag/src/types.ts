import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { ColDef, GridOptions } from "ag-grid-community";

export type ColDefAg = ColDef<GridRow>;

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<GridOptions<GridRow>, "rowData" | "columnDefs" | "getRowId">;
