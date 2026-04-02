import {
  dateCellRenderer,
  ujsonObjectCellRenderer,
  ujsonValueCellRenderer,
} from "#config-generators/column-generators/column-utils/cellRenderers.tsx";
import {
  booleanToString,
  stringDateToDate,
} from "#config-generators/column-generators/column-utils/valueTransformers.ts";
import type {
  ColDefTanstack,
  PluginConfigTanstack,
} from "#config-generators/configGeneratorTanstack.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
} from "@jsoc/grid-core";
import {
  toReadableString,
  type UJSONObject,
  type UJSONObjectArray,
  type UJSONValue,
} from "@jsoc/utils";

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
  return extendBaseColumn(params, {
    enableSorting: true,
    enableColumnFilter: true,
    // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
    sortingFn: "text",
  });
};

const booleanColumnGenerator: ColumnGeneratorTanstack = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as boolean;
      return booleanToString(value);
    },
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: "text",
  });
};

const numberColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: "alphanumeric",
  });
};

const stringDateColumnGenerator: ColumnGeneratorTanstack = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as string;
      return stringDateToDate(value);
    },
    cell: ({ cell }) => dateCellRenderer(cell.getValue<Date>()),
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: "datetime",
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    cell: ({ cell, row }) => {
      const value = cell.getValue<UJSONObject>();
      return ujsonObjectCellRenderer(params, value, row.original);
    },
    enableSorting: false,
    enableColumnFilter: false,
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    cell: ({ cell, row }) => {
      const value = cell.getValue<UJSONObjectArray>();
      return ujsonObjectCellRenderer(params, value, row.original);
    },
    enableSorting: false,
    enableColumnFilter: false,
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    cell: ({ cell }) => {
      const value = cell.getValue<UJSONValue>();
      return ujsonValueCellRenderer(value);
    },
    enableSorting: false,
    enableColumnFilter: false,
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
