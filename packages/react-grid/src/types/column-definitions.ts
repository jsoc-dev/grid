import type { GridRow } from "@jsoc/grid-core";
import type { GridColDef } from "@mui/x-data-grid";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColDef } from "ag-grid-community";
import type { TableColumnProps } from "antd";
import type { MRT_ColumnDef } from "mantine-react-table";
import type { ColumnProps } from "primereact/column";

export type ColDefAg = ColDef<GridRow>;
export type ColDefAnt = TableColumnProps<GridRow>;
export type ColDefMantine = MRT_ColumnDef<GridRow>;
export type ColDefMui = GridColDef<GridRow>;
export type ColDefPrime = ColumnProps;
export type ColDefTanstack = ColumnDef<GridRow>;
