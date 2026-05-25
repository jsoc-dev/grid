import type { ColDefAg } from "@jsoc/grid-ag-shared";
import type { GridRow, GridStore, PluginConfig } from "@jsoc/grid-core";
import type { GridOptions } from "ag-grid-community";

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<GridOptions<GridRow>, "rowData" | "columnDefs" | "getRowId">;

export type GridStoreAg = GridStore<PluginConfigAg>;
