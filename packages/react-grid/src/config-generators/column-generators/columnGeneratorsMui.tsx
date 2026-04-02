import { SubGridToggle } from "#components/index.ts";
import type {
  ColDefMui,
  PluginConfigMui,
} from "#config-generators/configGeneratorMui.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridData,
  type GridDataReadonly,
  type GridRow,
  type GridRowId,
  type GridRows,
} from "@jsoc/grid-core";
import { encodePretty, ensureArray, toReadableString } from "@jsoc/utils";
import type { GridRenderCellParams } from "@mui/x-data-grid";

export type ColumnGeneratorMui = ColumnGenerator<PluginConfigMui>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefMui>,
): ColDefMui {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    filterable: true,
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "string",
  });
};

const booleanColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "boolean",
  });
};

const numberColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "number",
  });
};

const stringDateColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    type: "dateTime",
    /**
     * For dateTime type, value is expected to be Date() object.
     */
    valueGetter: (value: string) => new Date(value),
  });
};

/**
 * Provides column definitions for column having values as arrayOfObjects
 */
const ujsonObjectColumnGenerator: ColumnGeneratorMui = (params) => {
  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

  return extendBaseColumn(params, {
    // type: "actions",
    sortable: false,
    filterable: false,
    /**
     * For ensuring the value to be used is array, as same column definitons will be used for `object` type columns also.
     */
    valueGetter: (value: GridDataReadonly) => ensureArray(value as GridData),
    /**
     * Returns value which will be used in exporting, as suggested in:
     * https://mui.com/x/react-data-grid/column-definition/#:~:text=When%20using%20renderCell,exporting%20the%20data.
     * Value returned by valueFormatter is not used for filtering/sorting as it is only for rendering purposes. In this
     * case, it won't be used for rendering also as renderCell is provided. So, this is solely for value to use in the
     * export operation.
     */
    valueFormatter: (value: GridRows) => {
      return encodePretty(value);
    },
    /**
     * Returns a button that allows toggling SubGrid which represents the data for this column.
     * Uses the value from valueGetter which is ensured array of objects to represent in the SubGrid.
     *
     * CANDO: Is there any benefit if we wrap <ToggleSubGridButtonMui> inside <GridActionsCell> ?
     */
    renderCell: (params: GridRenderCellParams<GridRow, GridData>) => {
      const { row, value } = params;

      if (!value) {
        return;
      }

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row[primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorMui = (params) => {
  return ujsonObjectColumnGenerator(params);
};

const ujsonValueColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filterable: false,
    valueGetter: (value: unknown) => {
      return encodePretty(value);
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
