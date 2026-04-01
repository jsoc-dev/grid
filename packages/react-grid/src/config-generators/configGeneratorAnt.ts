import { COLUMN_GENERATOR_BY_TYPE_ANT } from "#config-generators/column-generators/columnGeneratorsAnt.tsx";

import {
  generateColumns,
  type GridRow,
  type GridRowId,
  type PluginConfig,
  type PluginConfigGenerator,
} from "@jsoc/grid-core";
import type { TableColumnProps, TableProps } from "antd";

export type ColDefAnt = TableColumnProps<GridRow>;

export type PluginConfigAnt = Pick<
  TableProps<GridRow>,
  "columns" | "dataSource" | "rowKey"
> &
  PluginConfig<ColDefAnt>;

export const configGeneratorAnt: PluginConfigGenerator<PluginConfigAnt> = (
  gridSchema,
  options,
) => {
  const { rows, primaryColumnKey } = gridSchema.meta;
  const columns = generateColumns<PluginConfigAnt>(
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
