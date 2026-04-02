import { SubGridToggle } from "#components/index.ts";
import type {
  ColDefTanstack,
  PluginConfigTanstack,
} from "#config-generators/configGeneratorTanstack.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridData,
  type GridRowId,
} from "@jsoc/grid-core";
import { encodePretty, toReadableString } from "@jsoc/utils";

export type ColumnGeneratorTanstack = ColumnGenerator<PluginConfigTanstack>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefTanstack>,
): ColDefTanstack {
  const { columnKey, columnDataType } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    meta: { type: columnDataType }, // this is just for reference, it has no bearing on the column definition
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const booleanColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const numberColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const stringDateColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const ujsonObjectColumnGenerator: ColumnGeneratorTanstack = (params) => {
  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
    cell: (cellContext) => {
      const value = cellContext.getValue<GridData>();
      const row = cellContext.row.original;

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

const ujsonObjectArrayColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return ujsonObjectColumnGenerator(params);
};

const ujsonValueColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
    cell: (cellContext) => {
      const value = cellContext.getValue();
      return encodePretty(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_TANSTACK: ColumnGeneratorByType<PluginConfigTanstack> =
  {
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
  };
