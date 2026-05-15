import type { ColDefTanstack } from "#types.ts";

import type { ColumnDataType, ColumnGeneratorParams } from "@jsoc/grid-core";
import {
  booleanToString,
  stringDateToDate,
  toReadableString,
  type UJSONValue,
  ujsonValueToString,
} from "@jsoc/utils";

/**
 * Builds the base TanStack column definition with id/accessor/header from {@link ColumnGeneratorParams}.
 * Adapters and shared generators extend this with sorting/filter/cell overrides.
 */
export function extendBaseColumn<D extends ColumnDataType>(
  params: ColumnGeneratorParams<D>,
  overrides?: Partial<ColDefTanstack>,
): ColDefTanstack {
  const { columnKey, columnDataType } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    // For reference only; has no bearing on the column definition.
    meta: { type: columnDataType },
    ...overrides,
  };
}

export const sharedStringColumnGenerator = (
  params: ColumnGeneratorParams<"string">,
): ColDefTanstack => {
  return extendBaseColumn(params, {
    enableSorting: true,
    enableColumnFilter: true,
    // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
    sortingFn: "text",
  });
};

export const sharedBooleanColumnGenerator = (
  params: ColumnGeneratorParams<"boolean">,
): ColDefTanstack => {
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

export const sharedNumberColumnGenerator = (
  params: ColumnGeneratorParams<"number">,
): ColDefTanstack => {
  return extendBaseColumn(params, {
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: "alphanumeric",
  });
};

export const sharedStringDateColumnGenerator = (
  params: ColumnGeneratorParams<"stringDate">,
): ColDefTanstack => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    accessorFn: (originalRow) => {
      const value = originalRow[columnKey] as string;
      return stringDateToDate(value);
    },
    cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: "datetime",
  });
};

/**
 * Shared shape for `ujsonObject` columns. Adapters override `cell` with a framework-specific renderer.
 */
export const sharedUjsonObjectColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonObject">,
): ColDefTanstack => {
  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
  });
};

/**
 * Shared shape for `ujsonObjectArray` columns. Adapters override `cell` with a framework-specific renderer.
 */
export const sharedUjsonObjectArrayColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonObjectArray">,
): ColDefTanstack => {
  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
  });
};

export const sharedUjsonValueColumnGenerator = (
  params: ColumnGeneratorParams<"ujsonValue">,
): ColDefTanstack => {
  return extendBaseColumn(params, {
    cell: ({ cell }) => {
      const value = cell.getValue<UJSONValue>();
      return ujsonValueToString(value);
    },
    enableSorting: false,
    enableColumnFilter: false,
  });
};
