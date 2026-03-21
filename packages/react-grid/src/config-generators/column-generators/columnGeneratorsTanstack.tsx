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

function mergeColumnDef(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColumnDef<GridRow>>,
  defaults: Partial<ColumnDef<GridRow>> = {},
) {
  const { columnKey } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    ...defaults,
    ...overrides,
  };
}

export const baseColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params) => mergeColumnDef(params);

export const stringColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => mergeColumnDef(params, overrides);

export const booleanColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
    cell: (info) => (info.getValue() != null ? String(info.getValue()) : ""),
  });
};

export const numberColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  return mergeColumnDef(params, overrides);
};

export const stringDateColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
    cell: (info) => {
      const value = info.getValue();
      return new Date(value as string).toLocaleString();
    },
  });
};

export const arrayOfObjectsColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  const { columnKey, gridSchema } = params;

  return mergeColumnDef(params, overrides, {
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

export const objectColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  return arrayOfObjectsColumnGeneratorTanstack(params, overrides);
};

export const unresolvedColumnGeneratorTanstack: ColumnGenerator<
  PluginConfigTanstack
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
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
    arrayOfObjects: arrayOfObjectsColumnGeneratorTanstack,
    boolean: booleanColumnGeneratorTanstack,
    number: numberColumnGeneratorTanstack,
    object: objectColumnGeneratorTanstack,
    stringDate: stringDateColumnGeneratorTanstack,
    string: stringColumnGeneratorTanstack,
    unresolved: unresolvedColumnGeneratorTanstack,
  };
