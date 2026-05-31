import {
  COLUMN_DATA_TYPES,
  type ColumnDataType,
  type ColumnGenerator,
  type ColumnGeneratorByType,
} from "@jsoc/grid-core";
import {
  type PluginConfigTanstack,
  sharedBooleanColumnGenerator,
  sharedNumberColumnGenerator,
  sharedStringColumnGenerator,
  sharedStringDateColumnGenerator,
  sharedUjsonObjectArrayColumnGenerator,
  sharedUjsonObjectColumnGenerator,
  sharedUjsonValueColumnGenerator,
} from "@jsoc/grid-tanstack-shared";
import { ChildGridToggle } from "@jsoc/vue-grid";
import { h } from "vue";

export type ColumnGeneratorTanstack<D extends ColumnDataType> = ColumnGenerator<
  PluginConfigTanstack,
  D
>;

const stringColumnGenerator: ColumnGeneratorTanstack<"string"> = (params) => {
  return sharedStringColumnGenerator(params);
};

const booleanColumnGenerator: ColumnGeneratorTanstack<"boolean"> = (params) => {
  return sharedBooleanColumnGenerator(params);
};

const numberColumnGenerator: ColumnGeneratorTanstack<"number"> = (params) => {
  return sharedNumberColumnGenerator(params);
};

const stringDateColumnGenerator: ColumnGeneratorTanstack<"stringDate"> = (
  params,
) => {
  return sharedStringDateColumnGenerator(params);
};

const ujsonObjectColumnGenerator: ColumnGeneratorTanstack<"ujsonObject"> = (
  params,
) => {
  return {
    ...sharedUjsonObjectColumnGenerator(params),
    cell: ({ row }) =>
      h(ChildGridToggle, {
        row: row.original,
        columnKey: params.columnKey,
      }),
  };
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorTanstack<
  "ujsonObjectArray"
> = (params) => {
  return {
    ...sharedUjsonObjectArrayColumnGenerator(params),
    cell: ({ row }) =>
      h(ChildGridToggle, {
        row: row.original,
        columnKey: params.columnKey,
      }),
  };
};

const ujsonValueColumnGenerator: ColumnGeneratorTanstack<"ujsonValue"> = (
  params,
) => {
  return sharedUjsonValueColumnGenerator(params);
};

export const COLUMN_GENERATORS: ColumnGeneratorByType<PluginConfigTanstack> = {
  [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
  [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
  [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
  [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
};
