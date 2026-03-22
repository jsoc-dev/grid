import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigMantine } from "#config-generators/configGeneratorMantine.ts";

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
import type { MRT_Cell, MRT_ColumnDef, MRT_Row } from "mantine-react-table";

function mergeColumnDef(
  params: ColumnGeneratorParams,
  overrides?: Partial<MRT_ColumnDef<GridRow>>,
  defaults: Partial<MRT_ColumnDef<GridRow>> = {},
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

export const baseColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params) => mergeColumnDef(params);

export const stringColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => mergeColumnDef(params, overrides);

export const booleanColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
    Cell: ({ cell }: { cell: MRT_Cell<GridRow> }) =>
      cell.getValue() != null ? String(cell.getValue()) : "",
  });
};

export const numberColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  return mergeColumnDef(params, overrides);
};

export const stringDateColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
    Cell: ({ cell }: { cell: MRT_Cell<GridRow> }) => {
      const value = cell.getValue();
      return new Date(value as string).toLocaleString();
    },
  });
};

export const arrayOfObjectsColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  const { columnKey, gridSchema } = params;

  return mergeColumnDef(params, overrides, {
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({
      cell,
      row,
    }: {
      cell: MRT_Cell<GridRow>;
      row: MRT_Row<GridRow>;
    }) => {
      const value = cell.getValue();

      return (
        <SubGridToggle
          subGridData={value as GridData}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row.original[gridSchema.meta.primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

export const objectColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  return arrayOfObjectsColumnGeneratorMantine(params, overrides);
};

export const unresolvedColumnGeneratorMantine: ColumnGenerator<
  PluginConfigMantine
> = (params, overrides) => {
  return mergeColumnDef(params, overrides, {
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ cell }: { cell: MRT_Cell<GridRow> }) => {
      const value = cell.getValue();

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

export const COLUMN_GENERATOR_BY_TYPE_MANTINE: ColumnGeneratorByType<PluginConfigMantine> =
  {
    arrayOfObjects: arrayOfObjectsColumnGeneratorMantine,
    boolean: booleanColumnGeneratorMantine,
    number: numberColumnGeneratorMantine,
    object: objectColumnGeneratorMantine,
    stringDate: stringDateColumnGeneratorMantine,
    string: stringColumnGeneratorMantine,
    unresolved: unresolvedColumnGeneratorMantine,
  };
