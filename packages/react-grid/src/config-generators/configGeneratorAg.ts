import { COLUMN_GENERATOR_BY_TYPE_AG } from "#config-generators/column-generators/index.ts";
import type { ConfigGeneratorAg } from "#types/index.ts";

import { generateColumns, type GridRowId } from "@jsoc/grid-core";

export const configGeneratorAg: ConfigGeneratorAg = (gridSchema, options) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columnDefs = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_AG,
    options?.customColumnGeneratorByType,
  );

  return {
    columnDefs,
    getRowId: ({ data }) => String(data[primaryColumnKey] as GridRowId),
    rowData: rows,
  };
};
