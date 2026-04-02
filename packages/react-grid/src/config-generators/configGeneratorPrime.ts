import { COLUMN_GENERATOR_BY_TYPE_PRIME } from "#config-generators/column-generators/columnGeneratorsPrime.tsx";
import type { ConfigGeneratorPrime } from "#types/index.ts";

import { generateColumns } from "@jsoc/grid-core";

export const configGeneratorPrime: ConfigGeneratorPrime = (
  gridSchema,
  options,
) => {
  const { rows } = gridSchema.meta;
  const columns = generateColumns(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_PRIME,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    value: rows,
  };
};
