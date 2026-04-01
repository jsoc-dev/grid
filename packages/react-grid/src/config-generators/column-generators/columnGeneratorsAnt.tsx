import { SubGridToggle } from "#components/index.ts";
import type {
  ColDefAnt,
  PluginConfigAnt,
} from "#config-generators/configGeneratorAnt.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridData,
  type GridRow,
  type GridRowId,
} from "@jsoc/grid-core";
import {
  compareBooleans,
  compareNumbers,
  compareStringDates,
  compareStrings,
  encodePretty,
  toReadableString,
} from "@jsoc/utils";

export type ColumnGeneratorAnt = ColumnGenerator<PluginConfigAnt>;

function extendBaseColumn(
  params: ColumnGeneratorParams,
  overrides?: Partial<ColDefAnt>,
): ColDefAnt {
  const { columnKey } = params;

  return {
    dataIndex: columnKey,
    title: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a: GridRow, b: GridRow) => {
      return compareStrings(a[columnKey] as string, b[columnKey] as string);
    },
    // filters: [{text: ..., value: ...}] // skipping as it requires static value filters which can vary based on data
  });
};

const booleanColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a: GridRow, b: GridRow) => {
      return compareBooleans(a[columnKey] as boolean, b[columnKey] as boolean);
    },
    // TODO create a generic helper for rendering boolean column data for all grid plugins
    render: (value: boolean) => {
      return value.toString();
    },
  });
};

const numberColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a: GridRow, b: GridRow) => {
      return compareNumbers(a[columnKey] as number, b[columnKey] as number);
    },
  });
};

const stringDateColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    // TODO create a generic helper for rendering date for all grid plugins
    render: (value: string) => {
      return new Date(value).toLocaleString();
    },

    sorter: (a: GridRow, b: GridRow) => {
      return compareStringDates(a[columnKey] as string, b[columnKey] as string);
    },
  });
};

const arrayOfObjectsColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

  return extendBaseColumn(params, {
    // TODO create a generic helper for rendering subgrid toggle for all grid plugins
    render: (value: GridData, record) => {
      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: record[primaryColumnKey] as GridRowId,
            columnKey,
          }}
        />
      );
    },
  });
};

const objectColumnGenerator: ColumnGeneratorAnt = (params) => {
  return arrayOfObjectsColumnGenerator(params);
};

const unresolvedColumnGenerator: ColumnGeneratorAnt = (params) => {
  return extendBaseColumn(params, {
    // TODO create a generic helper for rendering unresolved column data for all grid plugins
    render: (value: unknown) => {
      return encodePretty(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_ANT: ColumnGeneratorByType<PluginConfigAnt> =
  {
    [COLUMN_DATA_TYPES.arrayOfObjects]: arrayOfObjectsColumnGenerator,
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.object]: objectColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.unresolved]: unresolvedColumnGenerator,
  };
