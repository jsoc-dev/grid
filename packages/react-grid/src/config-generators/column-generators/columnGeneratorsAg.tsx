import { SubGridToggle } from "#components/index.ts";
import type {
  ColDefAg,
  PluginConfigAg,
} from "#config-generators/configGeneratorAg.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridData,
  type GridRow,
  type GridRowId,
} from "@jsoc/grid-core";
import { encodePretty, toReadableString } from "@jsoc/utils";
import type { ICellRendererParams } from "ag-grid-community";

export type ColumnGeneratorAg = ColumnGenerator<PluginConfigAg>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefAg>,
): ColDefAg {
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

const ujsonObjectColumnGenerator: ColumnGeneratorAg = (params) => {
  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

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
    cellRenderer: (params: ICellRendererParams<GridRow, GridData>) => {
      const { data, value } = params;

      if (!data || !value) {
        return;
      }

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: data[primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorAg = (params) => {
  return ujsonObjectColumnGenerator(params);
};

const ujsonValueColumnGenerator: ColumnGeneratorAg = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    valueFormatter: (params) => {
      const { value } = params;
      return encodePretty(value);
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
