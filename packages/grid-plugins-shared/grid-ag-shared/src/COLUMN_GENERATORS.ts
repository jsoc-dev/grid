import type { ColDefAg } from "#types.ts";

import type {
  ColumnDataType,
  ColumnGeneratorParams,
  GridRow,
  PluginConfig,
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
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";

export function getBaseColumnDef<
  C extends PluginConfig,
  D extends ColumnDataType,
>(
  params: ColumnGeneratorParams<C, D>,
  overrides?: Partial<ColDefAg>,
): ColDefAg {
  const { columnKey } = params;
  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    ...overrides,
  };
}

export function sharedStringColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "string">,
): ColDefAg {
  return getBaseColumnDef(params, {
    cellDataType: "text",
    sortable: true,
    filter: true,
  });
}

export function sharedBooleanColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "boolean">,
): ColDefAg {
  return getBaseColumnDef(params, {
    cellDataType: "boolean",
    sortable: true,
    filter: true,
  });
}

export function sharedNumberColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "number">,
): ColDefAg {
  return getBaseColumnDef(params, {
    cellDataType: "number",
    sortable: true,
    filter: true,
  });
}

export function sharedStringDateColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "stringDate">,
): ColDefAg {
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
}

export function sharedUjsonObjectColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "ujsonObject">,
): ColDefAg {
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
}

export function sharedUjsonObjectArrayColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "ujsonObjectArray">,
): ColDefAg {
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
}

export function sharedUjsonValueColumnGenerator<C extends PluginConfig>(
  params: ColumnGeneratorParams<C, "ujsonValue">,
): ColDefAg {
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
}
