import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigTanstack } from "#config-generators/configGeneratorTanstack.ts";

import type {
  ColumnGenerator,
  ColumnGeneratorByType,
  ColumnGeneratorParams,
  GridData,
  GridRow,
  GridRowId,
} from "@jsoc/grid-core";
import {
  encodePretty,
  ensureString,
  isArray,
  isPlainObject,
  toReadableString,
} from "@jsoc/utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";

export type ColumnGeneratorTanstack = ColumnGenerator<PluginConfigTanstack>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColumnDef<GridRow>>,
): ColumnDef<GridRow> {
  const { columnKey } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const booleanColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    cell: (info) => (info.getValue() != null ? String(info.getValue()) : ""),
  });
};

const numberColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params);
};

const stringDateColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    cell: (info) => {
      const value = info.getValue();
      return new Date(value as string).toLocaleString();
    },
  });
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorTanstack = (params) => {
  const { columnKey, gridSchema } = params;

  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info) => {
      const value = info.getValue();
      const row = info.row.original;

      return (
        <SubGridToggle
          subGridData={value as GridData}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row[gridSchema.meta.primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

const objectColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorTanstack = (params) => {
  return extendBaseColumn(params, {
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info: CellContext<GridRow, unknown>) => {
      const value = info.getValue();

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

export const COLUMN_GENERATOR_BY_TYPE_TANSTACK: ColumnGeneratorByType<PluginConfigTanstack> =
  {
    arrayOfObjects: arrayOfObjectsColumnGenerator,
    boolean: booleanColumnGenerator,
    number: numberColumnGenerator,
    object: objectColumnGenerator,
    stringDate: stringDateColumnGenerator,
    string: stringColumnGenerator,
    unresolved: unresolvedColumnGenerator,
  };
