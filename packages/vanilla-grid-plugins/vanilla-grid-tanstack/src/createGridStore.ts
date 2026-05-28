import { COLUMN_GENERATORS } from "#COLUMN_GENERATORS.ts";
import type {
  ConfigGeneratorTanstack,
  GridStoreOptionsTanstack,
  GridStoreTanstack,
} from "#types.ts";

import { generateColumns, getRowIdString } from "@jsoc/grid-core";
import { createGridStoreCore } from "@jsoc/vanilla-grid";

export function createGridStore(
  options: GridStoreOptionsTanstack,
): GridStoreTanstack {
  return createGridStoreCore({ ...options, configGenerator });
}

const configGenerator: ConfigGeneratorTanstack = (gridSchema, options) => {
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATORS,
    options?.customColumnGeneratorByType,
  );

  return {
    data: gridSchema.rows,
    columns,
    getRowId: (row) => getRowIdString(row, gridSchema.primaryColumnKey),
  };
};
