import type { GridRow, PluginConfig } from "@jsoc/grid-core";
import type { TableColumnProps, TableProps } from "antd";

export type ColDefAnt = TableColumnProps<GridRow>;

export type PluginConfigAnt = PluginConfig<ColDefAnt> &
  Pick<TableProps<GridRow>, "columns" | "dataSource" | "rowKey">;
