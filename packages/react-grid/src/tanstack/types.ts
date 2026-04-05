import type {
  ColumnGenerator,
  GridRow,
  PluginConfig,
  PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { ColumnDef, TableOptions } from "@tanstack/react-table";

export type ColDefTanstack = ColumnDef<GridRow>;

export type PluginConfigTanstack = PluginConfig<ColDefTanstack> &
  Pick<TableOptions<GridRow>, "columns" | "data" | "getRowId">;

export type ConfigGeneratorTanstack =
  PluginConfigGenerator<PluginConfigTanstack>;
export type ColumnGeneratorTanstack = ColumnGenerator<PluginConfigTanstack>;
