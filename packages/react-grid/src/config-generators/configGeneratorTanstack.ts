import { COLUMN_GENERATOR_BY_TYPE_TANSTACK } from "#config-generators/column-generators/index.ts";
import type { ConfigGeneratorTanstack } from "#types/index.ts";

import { generateColumns, type GridRowId } from "@jsoc/grid-core";

export const configGeneratorTanstack: ConfigGeneratorTanstack = (
  gridSchema,
  options,
) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_TANSTACK,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    data: rows,
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
  };
};
