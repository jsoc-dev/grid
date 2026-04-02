import { COLUMN_GENERATOR_BY_TYPE_MANTINE } from "#config-generators/column-generators/index.ts";
import type { ConfigGeneratorMantine } from "#types/index.ts";

import { generateColumns, type GridRowId } from "@jsoc/grid-core";

export const configGeneratorMantine: ConfigGeneratorMantine = (
  gridSchema,
  options,
) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_MANTINE,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    data: rows,
    getRowId: (row) => String(row[primaryColumnKey] as GridRowId),
  };
};
