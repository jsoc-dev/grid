import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { MRT_ColumnDef, MRT_TableOptions } from "mantine-react-table";

export type ColDefMantine = MRT_ColumnDef<GridRow>;

export type PluginConfigMantine = PluginConfig<ColDefMantine> &
  Pick<MRT_TableOptions<GridRow>, "columns" | "data" | "getRowId">;
