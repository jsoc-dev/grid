import { SubGridToggle } from "#components/index.ts";
import type {
  ColDefPrime,
  PluginConfigPrime,
} from "#config-generators/configGeneratorPrime.ts";

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

export type ColumnGeneratorPrime = ColumnGenerator<PluginConfigPrime>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefPrime>,
): ColDefPrime {
  const { columnKey } = params;

  return {
    field: columnKey,
    header: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorPrime = (params) => {
  return extendBaseColumn(params, {
    dataType: "text",
    sortable: true,
    // filter: true, // skipping for now as it needs additional configs (filters prop on main component)
  });
};

const booleanColumnGenerator: ColumnGeneratorPrime = (params) => {
  return extendBaseColumn(params, {
    dataType: "boolean",
    sortable: true,
  });
};

const numberColumnGenerator: ColumnGeneratorPrime = (params) => {
  return extendBaseColumn(params, {
    dataType: "number",
    sortable: true,
  });
};

const stringDateColumnGenerator: ColumnGeneratorPrime = (params) => {
  return extendBaseColumn(params, {
    dataType: "date",
    sortable: true,
  });
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorPrime = (params) => {
  const { columnKey, gridSchema } = params;
  const primaryColumnKey = gridSchema.meta.primaryColumnKey;

  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    body: (data: GridRow) => {
      return (
        <SubGridToggle
          subGridData={data[columnKey] as GridData}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: data[primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

const objectColumnGenerator: ColumnGeneratorPrime = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorPrime = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    body: (data: GridRow) => {
      return encodePretty(data[columnKey]);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_PRIME: ColumnGeneratorByType<PluginConfigPrime> =
  {
    [COLUMN_DATA_TYPES.arrayOfObjects]: arrayOfObjectsColumnGenerator,
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.object]: objectColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.unresolved]: unresolvedColumnGenerator,
  };
