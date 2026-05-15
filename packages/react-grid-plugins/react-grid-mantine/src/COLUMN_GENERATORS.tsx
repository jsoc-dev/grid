import type { ColDefMantine, PluginConfigMantine } from "#types.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnDataType,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
} from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/react-grid";
import {
  booleanToString,
  stringDateToDate,
  toReadableString,
  type UJSONValue,
  ujsonValueToString,
} from "@jsoc/utils";

type ColumnGeneratorMantine<D extends ColumnDataType> = ColumnGenerator<
  PluginConfigMantine,
  D
>;

// NOTE: This helper and column generators below are very much similar to the corresponding tanstack column generators.
// But this code duplication is done intentionally because mantine plugin's internal tanstack dependency version can be
// different from the version used in this library's tanstack plugin, so there is chances of type mismatches.
// Also, we can't limit this library's tanstack version to match mantine's internal tanstack version as then it would be
// not possible to develop the tanstack plugin independently.
function extendBaseColumn<D extends ColumnDataType>(
  params: ColumnGeneratorParams<D>,
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

const stringColumnGenerator: ColumnGeneratorMantine<"string"> = (params) => {
  return extendBaseColumn(params, {
    enableColumnFilter: true,
    enableSorting: true,
    // https://www.mantine-react-table.com/docs/guides/column-filtering#filter-variants
    filterVariant: "text",
    // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
    sortingFn: "text",
  });
};

const booleanColumnGenerator: ColumnGeneratorMantine<"boolean"> = (params) => {
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

const numberColumnGenerator: ColumnGeneratorMantine<"number"> = (params) => {
  return extendBaseColumn(params, {
    enableColumnFilter: true,
    enableSorting: true,
    filterVariant: "range",
    sortingFn: "alphanumeric",
  });
};

const stringDateColumnGenerator: ColumnGeneratorMantine<"stringDate"> = (
  params,
) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as string;
      return stringDateToDate(value);
    },
    Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
    enableColumnFilter: true,
    enableSorting: true,
    filterVariant: "date",
    sortingFn: "datetime",
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorMantine<"ujsonObject"> = (
  params,
) => {
  return extendBaseColumn(params, {
    Cell: ({ row }) => (
      <ChildGridToggle row={row.original} columnKey={params.columnKey} />
    ),
    enableColumnFilter: false,
    enableSorting: false,
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorMantine<
  "ujsonObjectArray"
> = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ row }) => (
      <ChildGridToggle row={row.original} columnKey={params.columnKey} />
    ),
    enableColumnFilter: false,
    enableSorting: false,
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorMantine<"ujsonValue"> = (
  params,
) => {
  return extendBaseColumn(params, {
    Cell: ({ cell }) => {
      const value = cell.getValue<UJSONValue>();
      return ujsonValueToString(value);
    },
    enableColumnFilter: false,
    enableSorting: false,
  });
};

export const COLUMN_GENERATORS: ColumnGeneratorByType<PluginConfigMantine> = {
  [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
  [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
  [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
  [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
};
