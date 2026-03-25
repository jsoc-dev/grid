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

export type ColumnGeneratorMantine = ColumnGenerator<PluginConfigMantine>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<MRT_ColumnDef<GridRow>>,
): MRT_ColumnDef<GridRow> {
  const { columnKey } = params;

  return {
    id: columnKey,
    accessorKey: columnKey,
    header: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params);
};

const booleanColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ cell }: { cell: MRT_Cell<GridRow> }) =>
      cell.getValue() != null ? String(cell.getValue()) : "",
  });
};

const numberColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params);
};

const stringDateColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
    Cell: ({ cell }: { cell: MRT_Cell<GridRow> }) => {
      const value = cell.getValue();
      return new Date(value as string).toLocaleString();
    },
  });
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorMantine = (params) => {
  const { columnKey, gridSchema } = params;

  return extendBaseColumn(params, {
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

const objectColumnGenerator: ColumnGeneratorMantine = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params, {
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
    arrayOfObjects: arrayOfObjectsColumnGenerator,
    boolean: booleanColumnGenerator,
    number: numberColumnGenerator,
    object: objectColumnGenerator,
    stringDate: stringDateColumnGenerator,
    string: stringColumnGenerator,
    unresolved: unresolvedColumnGenerator,
  };
