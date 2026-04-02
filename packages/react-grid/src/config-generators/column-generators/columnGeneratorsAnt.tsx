import {
  booleanCellRenderer,
  stringDateCellRenderer,
  ujsonObjectCellRenderer,
  ujsonValueCellRenderer,
} from "#config-generators/column-generators/column-utils/cellRenderers.tsx";
import type {
  ColDefAnt,
  PluginConfigAnt,
} from "#config-generators/configGeneratorAnt.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
} from "@jsoc/grid-core";
import {
  compareBooleans,
  compareNumbers,
  compareStringDates,
  compareStrings,
  toReadableString,
  type UJSONObject,
  type UJSONObjectArray,
  type UJSONValue,
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
    sorter: (a, b) => {
      return compareStrings(a[columnKey] as string, b[columnKey] as string);
    },
    // filters: [{text: ..., value: ...}] // skipping as it requires static value filters which can vary based on data
  });
};

const booleanColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    render: (value: boolean) => {
      return booleanCellRenderer(value);
    },
    sorter: (a, b) => {
      return compareBooleans(a[columnKey] as boolean, b[columnKey] as boolean);
    },
  });
};

const numberColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a, b) => {
      return compareNumbers(a[columnKey] as number, b[columnKey] as number);
    },
  });
};

const stringDateColumnGenerator: ColumnGeneratorAnt = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    render: (value: string) => {
      return stringDateCellRenderer(value);
    },
    sorter: (a, b) => {
      return compareStringDates(a[columnKey] as string, b[columnKey] as string);
    },
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorAnt = (params) => {
  return extendBaseColumn(params, {
    render: (value: UJSONObject, record) => {
      return ujsonObjectCellRenderer(params, value, record);
    },
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorAnt = (params) => {
  return extendBaseColumn(params, {
    render: (value: UJSONObjectArray, record) => {
      return ujsonObjectCellRenderer(params, value, record);
    },
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorAnt = (params) => {
  return extendBaseColumn(params, {
    render: (value: UJSONValue) => {
      return ujsonValueCellRenderer(value);
    },
  });
};

export const COLUMN_GENERATOR_BY_TYPE_ANT: ColumnGeneratorByType<PluginConfigAnt> =
  {
    [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
    [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
    [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
    [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
    [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
  };
