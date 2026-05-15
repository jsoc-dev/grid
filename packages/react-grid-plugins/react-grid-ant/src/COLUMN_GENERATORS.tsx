import type { ColDefAnt, PluginConfigAnt } from "#types.ts";

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
  compareBooleans,
  compareNumbers,
  compareStringDates,
  compareStrings,
  stringDateToDate,
  toReadableString,
  type UJSONValue,
  ujsonValueToString,
} from "@jsoc/utils";

export type ColumnGeneratorAnt<D extends ColumnDataType> = ColumnGenerator<
  PluginConfigAnt,
  D
>;

function extendBaseColumn<D extends ColumnDataType>(
  params: ColumnGeneratorParams<D>,
  overrides?: Partial<ColDefAnt>,
): ColDefAnt {
  const { columnKey } = params;

  return {
    dataIndex: columnKey,
    title: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorAnt<"string"> = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a, b) => {
      return compareStrings(a[columnKey] as string, b[columnKey] as string);
    },
    // filters: [{text: ..., value: ...}] // skipping as it requires static value filters which can vary based on data
  });
};

const booleanColumnGenerator: ColumnGeneratorAnt<"boolean"> = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    render: (value: boolean) => booleanToString(value),
    sorter: (a, b) => {
      return compareBooleans(a[columnKey] as boolean, b[columnKey] as boolean);
    },
  });
};

const numberColumnGenerator: ColumnGeneratorAnt<"number"> = (params) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sorter: (a, b) => {
      return compareNumbers(a[columnKey] as number, b[columnKey] as number);
    },
  });
};

const stringDateColumnGenerator: ColumnGeneratorAnt<"stringDate"> = (
  params,
) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    render: (value: string) => {
      return stringDateToDate(value).toLocaleDateString();
    },
    sorter: (a, b) => {
      return compareStringDates(a[columnKey] as string, b[columnKey] as string);
    },
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorAnt<"ujsonObject"> = (
  params,
) => {
  return extendBaseColumn(params, {
    render: (_value, record) => (
      <ChildGridToggle row={record} columnKey={params.columnKey} />
    ),
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorAnt<
  "ujsonObjectArray"
> = (params) => {
  return extendBaseColumn(params, {
    render: (_value, record) => (
      <ChildGridToggle row={record} columnKey={params.columnKey} />
    ),
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorAnt<"ujsonValue"> = (
  params,
) => {
  return extendBaseColumn(params, {
    render: (value: UJSONValue) => {
      return ujsonValueToString(value);
    },
  });
};

export const COLUMN_GENERATORS: ColumnGeneratorByType<PluginConfigAnt> = {
  [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
  [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
  [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
  [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
};
