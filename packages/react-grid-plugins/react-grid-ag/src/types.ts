import type { ColDefAg } from "@jsoc/grid-ag-shared";
import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { AgGridReactProps } from "ag-grid-react";

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<AgGridReactProps<GridRow>, "rowData" | "columnDefs" | "getRowId">;
