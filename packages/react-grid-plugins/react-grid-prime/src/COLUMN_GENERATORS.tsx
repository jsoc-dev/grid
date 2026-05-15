import type { ColDefPrime, PluginConfigPrime } from "#types.ts";

import {
  COLUMN_DATA_TYPES,
  type ColumnDataType,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type ColumnGeneratorParams,
  type GridRow,
} from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/react-grid";
import { toReadableString, ujsonValueToString } from "@jsoc/utils";

export type ColumnGeneratorPrime<D extends ColumnDataType> = ColumnGenerator<
  PluginConfigPrime,
  D
>;

function extendBaseColumn<D extends ColumnDataType>(
  params: ColumnGeneratorParams<D>,
  overrides?: Partial<ColDefPrime>,
): ColDefPrime {
  const { columnKey } = params;

  return {
    field: columnKey,
    header: toReadableString(columnKey),
    ...overrides,
  };
}

const stringColumnGenerator: ColumnGeneratorPrime<"string"> = (params) => {
  return extendBaseColumn(params, {
    dataType: "text",
    sortable: true,
    // filter: true, // skipping for now as it needs additional configs (filters prop on main component)
  });
};

const booleanColumnGenerator: ColumnGeneratorPrime<"boolean"> = (params) => {
  return extendBaseColumn(params, {
    dataType: "boolean",
    sortable: true,
  });
};

const numberColumnGenerator: ColumnGeneratorPrime<"number"> = (params) => {
  return extendBaseColumn(params, {
    dataType: "number",
    sortable: true,
  });
};

const stringDateColumnGenerator: ColumnGeneratorPrime<"stringDate"> = (
  params,
) => {
  return extendBaseColumn(params, {
    dataType: "date",
    sortable: true,
  });
};

const ujsonObjectColumnGenerator: ColumnGeneratorPrime<"ujsonObject"> = (
  params,
) => {
  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    body: (data: GridRow) => (
      <ChildGridToggle row={data} columnKey={params.columnKey} />
    ),
  });
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorPrime<
  "ujsonObjectArray"
> = (params) => {
  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    body: (data: GridRow) => (
      <ChildGridToggle row={data} columnKey={params.columnKey} />
    ),
  });
};

const ujsonValueColumnGenerator: ColumnGeneratorPrime<"ujsonValue"> = (
  params,
) => {
  const { columnKey } = params;

  return extendBaseColumn(params, {
    sortable: false,
    filter: false,
    body: (data: GridRow) => {
      const value = data[columnKey];
      return ujsonValueToString(value);
    },
  });
};

export const COLUMN_GENERATORS: ColumnGeneratorByType<PluginConfigPrime> = {
  [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
  [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
  [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
  [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
};
