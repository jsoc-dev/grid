import { SubGridToggle } from "#components/index.ts";
import type { PluginConfigMantine } from "#config-generators/configGeneratorMantine.ts";

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
  return extendBaseColumn(params);
};

const numberColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params);
};

const stringDateColumnGenerator: ColumnGeneratorMantine = (params) => {
  return extendBaseColumn(params);
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorMantine = (params) => {
  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

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
      const value = cell.getValue<GridData>();

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row.original[primaryColumnKey] as GridRowId,
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
      return encodePretty(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_MANTINE: ColumnGeneratorByType<PluginConfigMantine> =
  {
    [COLUMN_DATA_TYPES.arrayOfObjects]: arrayOfObjectsColumnGenerator,
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.object]: objectColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.unresolved]: unresolvedColumnGenerator,
  };
