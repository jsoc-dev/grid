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
  ColDefMantine,
  PluginConfigMantine,
} from "#config-generators/configGeneratorMantine.ts";

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

export type ColumnGeneratorMantine = ColumnGenerator<PluginConfigMantine>;

// NOTE: This helper and column generators below are very much similar to the corresponding tanstack column generators.
// But this code duplication is done intentionally because mantine plugin's internal tanstack dependency version can be
// different from the version used in this library's tanstack plugin, so there is chances of type mismatches.
// Also, we can't limit this library's tanstack version to match mantine's internal tanstack version as then it would be
// not possible to develop the tanstack plugin independently.
function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefMantine>,
): ColDefMantine {
  const { columnKey } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    enableColumnFilter: true,
    enableSorting: true,
    // https://www.mantine-react-table.com/docs/guides/column-filtering#filter-variants
    filterVariant: "text",
    // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
    sortingFn: "text",
  });
};

const booleanColumnGenerator: ColumnGeneratorMantine = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as boolean;
      return booleanToString(value);
    },
    enableColumnFilter: true,
    enableSorting: true,
    filterVariant: "checkbox",
    sortingFn: "text",
  });
};

const numberColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    enableColumnFilter: true,
    enableSorting: true,
    filterVariant: "range",
    sortingFn: "alphanumeric",
  });
};

const stringDateColumnGenerator: ColumnGeneratorMantine = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as string;
      return stringDateToDate(value);
    },
    Cell: ({ cell }) => dateCellRenderer(cell.getValue<Date>()),
    enableColumnFilter: true,
    enableSorting: true,
    filterVariant: "date",
    sortingFn: "datetime",
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ cell, row }) => {
      const value = cell.getValue<UJSONObject>();
      return ujsonObjectCellRenderer(params, value, row.original);
    },
    enableColumnFilter: false,
    enableSorting: false,
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ cell, row }) => {
      const value = cell.getValue<UJSONObjectArray>();
      return ujsonObjectCellRenderer(params, value, row.original);
    },
    enableColumnFilter: false,
    enableSorting: false,
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ cell }) => {
      const value = cell.getValue<UJSONValue>();
      return ujsonValueCellRenderer(value);
    },
    enableColumnFilter: false,
    enableSorting: false,
  });
};

export const COLUMN_GENERATOR_BY_TYPE_MANTINE: ColumnGeneratorByType<PluginConfigMantine> =
  {
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
  };
