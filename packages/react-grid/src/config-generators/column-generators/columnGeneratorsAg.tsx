import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigAg } from "#config-generators/configGeneratorAg.ts";

import type {
  ColumnGenerator,
  ColumnGeneratorByType,
  ColumnGeneratorParams,
  GridRow,
} from "@jsoc/grid-core";
import {
  encodePretty,
  ensureString,
  isArray,
  isPlainObject,
  toReadableString,
} from "@jsoc/utils";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

export type ColumnGeneratorAg = ColumnGenerator<PluginConfigAg>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDef<GridRow>>,
): ColDef<GridRow> {
  const { columnKey } = params;

  return {
    field: columnKey,
    headerName: toReadableString(columnKey),
    filter: true,
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "text",
  });
};

const booleanColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "boolean",
  });
};

const numberColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "number",
  });
};

const stringDateColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    cellDataType: "dateTimeString",
  });
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorAg = (params) => {
  const { columnKey, gridSchema } = params;

  return extendBaseColumn(params, {
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
  });
};

const objectColumnGenerator: ColumnGeneratorAg = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
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
  });
};

export const COLUMN_GENERATOR_BY_TYPE_AG: ColumnGeneratorByType<PluginConfigAg> =
  {
    arrayOfObjects: arrayOfObjectsColumnGenerator,
    boolean: booleanColumnGenerator,
    number: numberColumnGenerator,
    object: objectColumnGenerator,
    stringDate: stringDateColumnGenerator,
    string: stringColumnGenerator,
    unresolved: unresolvedColumnGenerator,
  };
