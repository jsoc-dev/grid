import { ToggleSubGridButton } from "#grid/components/toggle-subgrid/ToggleSubGridButton.tsx";
import {
  ensureString,
  ensureArray,
  isArray,
  isPlainObject,
  encodePretty,
  toReadableString,
} from "@jsoc/core/utils";
import {
  ColumnFactory,
  type ColumnDefinitionProviderParams,
  type GridData,
  type GridDataReadonly,
  type GridRows,
} from "@jsoc/core/grid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const COLUMN_FACTORY_MUI: ColumnFactory<GridColDef> = {
  arrayOfObjects,
  boolean,
  number,
  object,
  stringDate,
  string,
  unresolved,
};

export function commonColDefMui(
  params: ColumnDefinitionProviderParams,
): GridColDef {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
  };
}

function string(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return {
    ...commonColDefMui(params),
    type: "string",

    ...definitionOverrides,
  };
}

function boolean(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return {
    ...commonColDefMui(params),
    type: "boolean",

    ...definitionOverrides,
  };
}

function number(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return {
    ...commonColDefMui(params),
    type: "number",

    ...definitionOverrides,
  };
}

function stringDate(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return {
    ...commonColDefMui(params),
    type: "dateTime",
    valueGetter: (value) => value && new Date(value),

    ...definitionOverrides,
  };
}

/**
 * Provides column definitions for column having values as arrayOfObjects
 */
function arrayOfObjects(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  const { columnKey, gridId, gridIdColumnKey } = params;

  return {
    ...commonColDefMui(params),
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
        <ToggleSubGridButton
          subGridData={value}
          parentGridId={gridId}
          parentGridCellLocation={{
            rowId: row[gridIdColumnKey],
            columnKey,
          }}
        />
      );
    },

    ...definitionOverrides,
  };
}

function object(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return arrayOfObjects(params, definitionOverrides);
}

function unresolved(
  params: ColumnDefinitionProviderParams,
  definitionOverrides?: Partial<GridColDef>,
): GridColDef {
  return {
    ...commonColDefMui(params),
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

    ...definitionOverrides,
  };
}
