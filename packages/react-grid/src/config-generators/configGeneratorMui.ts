import { COLUMN_GENERATOR_BY_TYPE_MUI } from "#config-generators/column-generators/index.ts";
import type { ConfigGeneratorMui } from "#mui/types.ts";

import { generateColumns, type GridRowId } from "@jsoc/grid-core";

export const configGeneratorMui: ConfigGeneratorMui = (gridSchema, options) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_MUI,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
    rows,
  };
};
