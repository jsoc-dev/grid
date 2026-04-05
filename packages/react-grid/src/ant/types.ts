import type {
  ColumnGenerator,
  GridRow,
  PluginConfig,
  PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { TableColumnProps, TableProps } from "antd";

export type ColDefAnt = TableColumnProps<GridRow>;

export type PluginConfigAnt = PluginConfig<ColDefAnt> &
  Pick<TableProps<GridRow>, "columns" | "dataSource" | "rowKey">;

export type ConfigGeneratorAnt = PluginConfigGenerator<PluginConfigAnt>;
export type ColumnGeneratorAnt = ColumnGenerator<PluginConfigAnt>;
