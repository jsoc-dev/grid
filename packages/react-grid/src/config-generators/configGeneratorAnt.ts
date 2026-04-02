import { COLUMN_GENERATOR_BY_TYPE_ANT } from "#config-generators/column-generators/columnGeneratorsAnt.tsx";
import type { ConfigGeneratorAnt } from "#types/index.ts";

import { generateColumns, type GridRowId } from "@jsoc/grid-core";

export const configGeneratorAnt: ConfigGeneratorAnt = (gridSchema, options) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_ANT,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    dataSource: rows,
    rowKey: (row) => String(row[primaryColumnKey] as GridRowId),
  };
};
