import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigMui } from "#config-generators/configGeneratorMui.ts";

import type { ColumnGeneratorByType } from "@jsoc/grid-core";
import type {
  ColumnGenerator,
  GridData,
  GridDataReadonly,
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
import type { GridRenderCellParams } from "@mui/x-data-grid";

export const baseColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
) => {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    filter: true,
  };
};

export const stringColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorMui(params),
    type: "string",

    ...overrides,
  };
};

export const booleanColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorMui(params),
    type: "boolean",

    ...overrides,
  };
};

export const numberColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorMui(params),
    type: "number",

    ...overrides,
  };
};

export const stringDateColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorMui(params),
    type: "dateTime",
    valueGetter: (value) => value && new Date(value),

    ...overrides,
  };
};

/**
 * Provides column definitions for column having values as arrayOfObjects
 */
export const arrayOfObjectsColumnGeneratorMui: ColumnGenerator<
  PluginConfigMui
> = (params, overrides) => {
  const { columnKey, gridSchema } = params;

  return {
    ...baseColumnGeneratorMui(params),
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

    ...overrides,
  };
};

export const objectColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return arrayOfObjectsColumnGeneratorMui(params, overrides);
};

export const unresolvedColumnGeneratorMui: ColumnGenerator<PluginConfigMui> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorMui(params),
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

    ...overrides,
  };
};

export const COLUMN_GENERATOR_BY_TYPE_MUI: ColumnGeneratorByType<PluginConfigMui> =
  {
    arrayOfObjects: arrayOfObjectsColumnGeneratorMui,
    boolean: booleanColumnGeneratorMui,
    number: numberColumnGeneratorMui,
    object: objectColumnGeneratorMui,
    stringDate: stringDateColumnGeneratorMui,
    string: stringColumnGeneratorMui,
    unresolved: unresolvedColumnGeneratorMui,
  };
