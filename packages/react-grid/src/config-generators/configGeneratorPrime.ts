import { COLUMN_GENERATOR_BY_TYPE_PRIME } from "#config-generators/column-generators/columnGeneratorsPrime.tsx";

import {
  generateColumns,
  type GridRows,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { ColumnProps } from "primereact/column";
import type { DataTableProps } from "primereact/datatable";

export type ColDefPrime = ColumnProps;
export type PluginConfigPrime = {
  columns: ColDefPrime[];
} & Pick<DataTableProps<GridRows>, "value"> &
  PluginConfig<ColDefPrime>;

export const configGeneratorPrime: PluginConfigGenerator<PluginConfigPrime> = (
  gridSchema,
  options,
) => {
  const { rows } = gridSchema.meta;
  const columns = generateColumns<PluginConfigPrime>(
    gridSchema,
    COLUMN_GENERATOR_BY_TYPE_PRIME,
    options?.customColumnGeneratorByType,
  );

  return {
    columns,
    value: rows,
  };
};
