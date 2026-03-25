import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigMui } from "#config-generators/configGeneratorMui.ts";

import type {
  ColumnGenerator,
  ColumnGeneratorByType,
  ColumnGeneratorParams,
  GridData,
  GridDataReadonly,
  GridRow,
  GridRows,
} from "@jsoc/grid-core";
import {
  encodePretty,
  ensureArray,
  ensureString,
  isArray,
  isPlainObject,
  toReadableString,
} from "@jsoc/utils";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRenderCellParams } from "@mui/x-data-grid";

export type ColumnGeneratorMui = ColumnGenerator<PluginConfigMui>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<GridColDef<GridRow>>,
): GridColDef<GridRow> {
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
    valueGetter: (value) => value && new Date(value),
  });
};

/**
 * Provides column definitions for column having values as arrayOfObjects
 */
const arrayOfObjectsColumnGenerator: ColumnGeneratorMui = (params) => {
  const { columnKey, gridSchema } = params;

  return extendBaseColumn(params, {
    type: "actions",
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
    renderCell: (params: GridRenderCellParams) => {
      const { row, value } = params;

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row[gridSchema.meta.primaryColumnKey],
            columnKey,
          }}
        />
      );
    },
  });
};

const objectColumnGenerator: ColumnGeneratorMui = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorMui = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filterable: false,
    /**
     * Converting the value to a string.
     */
    valueGetter: (value: unknown) => {
      if (isArray(value)) {
        if (value.some((x) => isPlainObject(x) || isArray(x))) {
          return encodePretty(value);
        } else {
          return value.join(", ");
        }
      }

      return ensureString(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_MUI: ColumnGeneratorByType<PluginConfigMui> =
  {
    arrayOfObjects: arrayOfObjectsColumnGenerator,
    boolean: booleanColumnGenerator,
    number: numberColumnGenerator,
    object: objectColumnGenerator,
    stringDate: stringDateColumnGenerator,
    string: stringColumnGenerator,
    unresolved: unresolvedColumnGenerator,
  };
