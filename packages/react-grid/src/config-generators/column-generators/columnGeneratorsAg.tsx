import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigAg } from "#config-generators/configGeneratorAg.ts";

import type { ColumnGenerator, ColumnGeneratorByType } from "@jsoc/grid-core";
import {
  encodePretty,
  ensureString,
  isArray,
  isPlainObject,
  toReadableString,
} from "@jsoc/utils";
import type { ICellRendererParams } from "ag-grid-community";

export const baseColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
) => {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    filter: true,
  };
};

export const stringColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorAg(params),
    cellDataType: "text",

    ...overrides,
  };
};

export const booleanColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorAg(params),
    cellDataType: "boolean",

    ...overrides,
  };
};

export const numberColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorAg(params),
    cellDataType: "number",

    ...overrides,
  };
};

export const stringDateColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorAg(params),
    cellDataType: "dateTimeString",

    ...overrides,
  };
};

export const arrayOfObjectsColumnGeneratorAg: ColumnGenerator<
  PluginConfigAg
> = (params, overrides) => {
  const { columnKey, gridSchema } = params;

  return {
    ...baseColumnGeneratorAg(params),
    cellDataType: "object",
    sortable: false,
    filter: false,
    valueFormatter: (params) => {
      const { value } = params;

      return encodePretty(value);
    },
    /**
     * Returns a button that allows toggling SubGrid which represents the data for this column.
     */
    cellRenderer: (params: ICellRendererParams) => {
      const { data, value } = params;

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: data[gridSchema.meta.primaryColumnKey],
            columnKey,
          }}
        />
      );
    },

    ...overrides,
  };
};

export const objectColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return arrayOfObjectsColumnGeneratorAg(params, overrides);
};

export const unresolvedColumnGeneratorAg: ColumnGenerator<PluginConfigAg> = (
  params,
  overrides,
) => {
  return {
    ...baseColumnGeneratorAg(params),
    sortable: false,
    filter: false,
    /**
     * Converting the value to a string.
     */
    valueFormatter: (params) => {
      const { value } = params;

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

export const COLUMN_GENERATOR_BY_TYPE_AG: ColumnGeneratorByType<PluginConfigAg> =
  {
    arrayOfObjects: arrayOfObjectsColumnGeneratorAg,
    boolean: booleanColumnGeneratorAg,
    number: numberColumnGeneratorAg,
    object: objectColumnGeneratorAg,
    stringDate: stringDateColumnGeneratorAg,
    string: stringColumnGeneratorAg,
    unresolved: unresolvedColumnGeneratorAg,
  };
