import {
  stringDateCellRenderer,
  ujsonObjectCellRenderer,
} from "#config-generators/column-generators/column-utils/cellRenderers.tsx";
import { ujsonValueToString } from "#config-generators/column-generators/column-utils/valueTransformers.ts";
import type {
  ColDefAg,
  ColumnGeneratorAg,
  PluginConfigAg,
} from "#types/index.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridRow,
} from "@jsoc/grid-core";
import {
  prettyJSON,
  toReadableString,
  type UJSONObject,
  type UJSONObjectArray,
  type UJSONValue,
} from "@jsoc/utils";
import type {
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefAg>,
): ColDefAg {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "text",
    sortable: true,
    filter: true,
  });
};

const booleanColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "boolean",
    sortable: true,
    filter: true,
  });
};

const numberColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "number",
    sortable: true,
    filter: true,
  });
};

const stringDateColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "dateTimeString",
    sortable: true,
    filter: true,
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      return value ? stringDateCellRenderer(value) : "";
    },
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorAg = (params) => {
  const { columnKey } = params;
  return extendBaseColumn(params, {
    cellDataType: "object",
    sortable: false,
    filter: false,
    /**
     * @see {@link https://www.ag-grid.com/react-data-grid/value-getters/ Value Getters}
     */
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONObject>) => {
      const { data } = gParams;
      if (!data) {
        return "";
      }
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
    /**
     * @see {@link https://www.ag-grid.com/react-data-grid/value-formatters/ Value Formatters}
     */
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      return value ? prettyJSON(value) : "";
    },
    /**
     * @see {@link https://www.ag-grid.com/react-data-grid/component-cell-renderer/ Cell Renderer}
     */
    cellRenderer: (rParams: ICellRendererParams<GridRow, string>) => {
      const { data, value } = rParams;
      return ujsonObjectCellRenderer(params, value, data);
    },
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorAg = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    // AG-Grid's object datatype refers to any complex datatype including arrays, not just objects
    // https://www.ag-grid.com/react-data-grid/cell-data-types/#object
    cellDataType: "object",
    sortable: false,
    filter: false,
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONObjectArray>) => {
      const { data } = gParams;
      if (!data) {
        return "";
      }
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
    valueFormatter: (fParams: ValueFormatterParams<GridRow, string>) => {
      const { value } = fParams;
      return value ? prettyJSON(value) : "";
    },
    cellRenderer: (rParams: ICellRendererParams<GridRow, string>) => {
      const { data, value } = rParams;
      return ujsonObjectCellRenderer(params, value, data);
    },
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorAg = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    valueGetter: (gParams: ValueGetterParams<GridRow, UJSONValue>) => {
      const { data } = gParams;
      if (!data) {
        return "";
      }
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_AG: ColumnGeneratorByType<PluginConfigAg> =
  {
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
  };
