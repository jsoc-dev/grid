import type { GridPlugin } from "#constants/plugins.ts";
import type {
  ColDefAg,
  ColDefAnt,
  ColDefMantine,
  ColDefMui,
  ColDefPrime,
  ColDefTanstack,
} from "#types/column-definitions.ts";

import type { GridRow, GridRows, PluginConfig } from "@jsoc/grid-core";
import type { DataGridProps } from "@mui/x-data-grid";
import type { TableOptions } from "@tanstack/react-table";
import type { AgGridReactProps } from "ag-grid-react";
import type { TableProps } from "antd";
import type { MRT_TableOptions } from "mantine-react-table";
import type { DataTableProps } from "primereact/datatable";

export type PluginConfigAg = PluginConfig<ColDefAg> &
  Pick<AgGridReactProps<GridRow>, "rowData" | "columnDefs" | "getRowId">;

export type PluginConfigAnt = PluginConfig<ColDefAnt> &
  Pick<TableProps<GridRow>, "columns" | "dataSource" | "rowKey">;

export type PluginConfigMantine = PluginConfig<ColDefMantine> &
  Pick<MRT_TableOptions<GridRow>, "columns" | "data" | "getRowId">;

export type PluginConfigMui = PluginConfig<ColDefMui> &
  Pick<DataGridProps<GridRow>, "rows" | "columns" | "getRowId">;

export type PluginConfigPrime = PluginConfig<ColDefPrime> &
  Pick<DataTableProps<GridRows>, "value"> & { columns: ColDefPrime[] };

export type PluginConfigTanstack = PluginConfig<ColDefTanstack> &
  Pick<TableOptions<GridRow>, "columns" | "data" | "getRowId">;

export interface ConfigByPlugin extends Record<GridPlugin, PluginConfig> {
  ag: PluginConfigAg;
  ant: PluginConfigAnt;
  mantine: PluginConfigMantine;
  mui: PluginConfigMui;
  prime: PluginConfigPrime;
  tanstack: PluginConfigTanstack;
}
