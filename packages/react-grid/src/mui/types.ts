import type {
  ColumnGenerator,
  GridRow,
  PluginConfig,
  PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { DataGridProps, GridColDef } from "@mui/x-data-grid";

export type ColDefMui = GridColDef<GridRow>;

export type PluginConfigMui = PluginConfig<ColDefMui> &
  Pick<DataGridProps<GridRow>, "rows" | "columns" | "getRowId">;

export type ConfigGeneratorMui = PluginConfigGenerator<PluginConfigMui>;
export type ColumnGeneratorMui = ColumnGenerator<PluginConfigMui>;
