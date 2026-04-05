import { ujsonObjectCellRenderer } from "#config-generators/column-generators/column-utils/cellRenderers.tsx";
import {
  stringDateToDate,
  ujsonValueToString,
} from "#config-generators/column-generators/column-utils/valueTransformers.ts";
import type {
  ColDefMui,
  ColumnGeneratorMui,
  PluginConfigMui,
} from "#mui/types.ts";

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
import type { GridRenderCellParams } from "@mui/x-data-grid";

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefMui>,
): ColDefMui {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "string",
    sortable: true,
    filterable: true,
  });
};

const booleanColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "boolean",
    sortable: true,
    filterable: true,
  });
};

const numberColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "number",
    sortable: true,
    filterable: true,
  });
};

const stringDateColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "dateTime",
    sortable: true,
    filterable: true,
    /**
     * For dateTime type, value is expected to be Date() object.
     */
    valueGetter: (value: string) => stringDateToDate(value),
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    // type: "actions",
    sortable: false,
    filterable: false,
    /**
     * Value to be used for filtering, sorting and default rendering. Though, for this column, sorting and filtering
     * are disabled. But the returned value is also made available to the valueFormatter and renderCell.
     * @see {@link https://mui.com/x/react-data-grid/column-definition/#value-getter Value Getter}
     */
    valueGetter: (value: UJSONObject) => ujsonValueToString(value),
    /**
     * Returns value which will be used in exporting, as suggested in:
     * https://mui.com/x/react-data-grid/column-definition/#:~:text=When%20using%20renderCell,exporting%20the%20data.
     * Value returned by valueFormatter is not used for filtering/sorting as it is only for rendering purposes. In this
     * case, it won't be used for rendering also as renderCell is provided. So, this is solely for value to use in the
     * export operation.
     *
     * @see {@link https://mui.com/x/react-data-grid/column-definition/#value-formatter Value Formatter}
     */
    valueFormatter: (value: string) => {
      return prettyJSON(value);
    },
    /**
     * Returns a button that allows toggling SubGrid which represents the data for this column.
     * Uses the value from valueGetter which is ensured array of objects to represent in the SubGrid.
     */
    renderCell: (rParams: GridRenderCellParams<GridRow, string>) => {
      const { row, value } = rParams;
      return ujsonObjectCellRenderer(params, value, row);
    },
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filterable: false,
    valueGetter: (value: UJSONObjectArray) => ujsonValueToString(value),
    valueFormatter: (value: string) => {
      return prettyJSON(value);
    },
    renderCell: (rParams: GridRenderCellParams<GridRow, string>) => {
      const { row, value } = rParams;
      return ujsonObjectCellRenderer(params, value, row);
    },
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filterable: false,
    valueGetter: (value: UJSONValue) => {
      return ujsonValueToString(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_MUI: ColumnGeneratorByType<PluginConfigMui> =
  {
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
  };
