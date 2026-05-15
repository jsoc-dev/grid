import type { GridRows, PluginConfig } from "@jsoc/grid-core";
import type { ColumnProps } from "primereact/column";
import type { DataTableProps } from "primereact/datatable";

export type ColDefPrime = ColumnProps;

export type PluginConfigPrime = PluginConfig<ColDefPrime> &
  Pick<DataTableProps<GridRows>, "value"> & { columns: ColDefPrime[] };
