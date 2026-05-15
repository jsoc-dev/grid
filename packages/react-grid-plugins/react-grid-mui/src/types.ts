import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { DataGridProps, GridColDef } from "@mui/x-data-grid";

export type ColDefMui = GridColDef<GridRow>;

export type PluginConfigMui = PluginConfig<ColDefMui> &
  Pick<DataGridProps<GridRow>, "rows" | "columns" | "getRowId">;
