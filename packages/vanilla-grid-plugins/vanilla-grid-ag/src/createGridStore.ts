import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";
import type {
  ConfigGeneratorAg,
  GridStoreAg,
  GridStoreOptionsAg,
} from "#types.ts";

import { generateColumns, getRowIdString } from "@jsoc/grid-core";
import { createGridStoreCore } from "@jsoc/vanilla-grid";

export function createGridStore(options: GridStoreOptionsAg): GridStoreAg {
  return createGridStoreCore({ ...options, configGenerator });
}

const configGenerator: ConfigGeneratorAg = (gridSchema, options) => {
  const columnDefs = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    rowData: gridSchema.rows,
    columnDefs,
    getRowId: ({ data }) => getRowIdString(data, gridSchema.primaryColumnKey),
  };
};
