import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { ColumnDef, TableOptions } from "@tanstack/table-core";

export type ColDefTanstack = ColumnDef<GridRow>;

export type PluginConfigTanstack = PluginConfig<ColDefTanstack> &
  Pick<TableOptions<GridRow>, "columns" | "data" | "getRowId">;
