import type {
  ColumnDataType,
  ColumnGeneratorParams,
  GridRow,
} from "@jsoc/grid-core";
import {
  prettyJSON,
  stringDateToDate,
  toReadableString,
  type UJSONObject,
  type UJSONObjectArray,
  type UJSONValue,
  ujsonValueToString,
} from "@jsoc/utils";
import type {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";

export function getBaseColumnDef<D extends ColumnDataType>(
  params: ColumnGeneratorParams<D>,
  overrides?: Partial<ColDef>,
): ColDef {
  const { columnKey } = params;
  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    ...overrides,
  };
}

export const sharedStringColumnGenerator = (
  params: ColumnGeneratorParams<"string">,
): ColDef => {
  return getBaseColumnDef(params, {
    cellDataType: "text",
    sortable: true,
    filter: true,
  });
};

export const sharedBooleanColumnGenerator = (
  params: ColumnGeneratorParams<"boolean">,
): ColDef => {
  return getBaseColumnDef(params, {
    cellDataType: "boolean",
    sortable: true,
    filter: true,
  });
};

export const sharedNumberColumnGenerator = (
  params: ColumnGeneratorParams<"number">,
): ColDef => {
  return getBaseColumnDef(params, {
    cellDataType: "number",
    sortable: true,
    filter: true,
  });
};

export const sharedStringDateColumnGenerator = (
  params: ColumnGeneratorParams<"stringDate">,
): ColDef => {
  return getBaseColumnDef(params, {
    cellDataType: "dateTimeString",
    sortable: true,
    filter: true,
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      if (!value) return "";
      return stringDateToDate(value).toLocaleString();
    },
  });
};

export const sharedUjsonObjectColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonObject">,
): ColDef => {
  const { columnKey } = params;
  return getBaseColumnDef(params, {
    cellDataType: "object",
    sortable: false,
    filter: false,
    // https://www.ag-grid.com/react-data-grid/value-getters/
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONObject>) => {
      const { data } = gParams;
      if (!data) return "";
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
    // https://www.ag-grid.com/react-data-grid/value-formatters/
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      return value ? prettyJSON(value) : "";
    },
  });
};

export const sharedUjsonObjectArrayColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonObjectArray">,
): ColDef => {
  const { columnKey } = params;
  return getBaseColumnDef(params, {
    cellDataType: "object",
    sortable: false,
    filter: false,
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONObjectArray>) => {
      const { data } = gParams;
      if (!data) return "";
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      return value ? prettyJSON(value) : "";
    },
  });
};

export const sharedUjsonValueColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonValue">,
): ColDef => {
  const { columnKey } = params;
  return getBaseColumnDef(params, {
    sortable: false,
    filter: false,
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONValue>) => {
      const { data } = gParams;
      if (!data) return "";
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
  });
};
