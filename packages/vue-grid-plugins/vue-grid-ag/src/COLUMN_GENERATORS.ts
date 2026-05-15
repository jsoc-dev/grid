import type { PluginConfigAg } from "#types.ts";

import {
  sharedBooleanColumnGenerator,
  sharedNumberColumnGenerator,
  sharedStringColumnGenerator,
  sharedStringDateColumnGenerator,
  sharedUjsonObjectArrayColumnGenerator,
  sharedUjsonObjectColumnGenerator,
  sharedUjsonValueColumnGenerator,
} from "@jsoc/grid-ag-shared";
import {
  COLUMN_DATA_TYPES,
  type ColumnDataType,
  type ColumnGenerator,
  type ColumnGeneratorByType,
  type GridRow,
} from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/vue-grid";
import type { ICellRendererParams } from "ag-grid-community";
import { h } from "vue";

export type ColumnGeneratorAg<D extends ColumnDataType> = ColumnGenerator<
  PluginConfigAg,
  D
>;

const stringColumnGenerator: ColumnGeneratorAg<"string"> = (params) => {
  return sharedStringColumnGenerator(params);
};

const booleanColumnGenerator: ColumnGeneratorAg<"boolean"> = (params) => {
  return sharedBooleanColumnGenerator(params);
};

const numberColumnGenerator: ColumnGeneratorAg<"number"> = (params) => {
  return sharedNumberColumnGenerator(params);
};

const stringDateColumnGenerator: ColumnGeneratorAg<"stringDate"> = (params) => {
  return sharedStringDateColumnGenerator(params);
};

const ujsonObjectColumnGenerator: ColumnGeneratorAg<"ujsonObject"> = (
  params,
) => {
  return {
    ...sharedUjsonObjectColumnGenerator(params),
    cellRenderer: (rParams: ICellRendererParams<GridRow, string>) => {
      const { data } = rParams;
      if (!data) return null;
      return h(ChildGridToggle, {
        row: data,
        columnKey: params.columnKey,
      });
    },
  };
};

const ujsonObjectArrayColumnGenerator: ColumnGeneratorAg<"ujsonObjectArray"> = (
  params,
) => {
  return {
    ...sharedUjsonObjectArrayColumnGenerator(params),
    cellRenderer: (rParams: ICellRendererParams<GridRow, string>) => {
      const { data } = rParams;
      if (!data) return null;
      return h(ChildGridToggle, {
        row: data,
        columnKey: params.columnKey,
      });
    },
  };
};

const ujsonValueColumnGenerator: ColumnGeneratorAg<"ujsonValue"> = (params) => {
  return sharedUjsonValueColumnGenerator(params);
};

export const COLUMN_GENERATORS: ColumnGeneratorByType<PluginConfigAg> = {
  [COLUMN_DATA_TYPES.boolean]: booleanColumnGenerator,
  [COLUMN_DATA_TYPES.number]: numberColumnGenerator,
  [COLUMN_DATA_TYPES.string]: stringColumnGenerator,
  [COLUMN_DATA_TYPES.stringDate]: stringDateColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObject]: ujsonObjectColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonObjectArray]: ujsonObjectArrayColumnGenerator,
  [COLUMN_DATA_TYPES.ujsonValue]: ujsonValueColumnGenerator,
};
