import { SubGridToggle } from "#components/SubGridToggle.tsx";
import {
  booleanToString,
  stringDateToDate,
} from "#config-generators/column-generators/column-utils/valueTransformers.ts";

import type {
  ColumnGeneratorParams,
  GridDataReadonly,
  GridRow,
  GridRowId,
} from "@jsoc/grid-core";
import { encodePretty, type UJSONValue } from "@jsoc/utils";

export const booleanCellRenderer = (value: boolean) => {
  return booleanToString(value);
};

export const dateCellRenderer = (value: Date) => {
  return value.toLocaleString();
};

export const stringDateCellRenderer = (value: string) => {
  return dateCellRenderer(stringDateToDate(value));
};

export const ujsonObjectCellRenderer = (
  params: ColumnGeneratorParams,
  value: GridDataReadonly | null | undefined,
  row: GridRow | null | undefined,
) => {
  if (!value || !row) {
    return;
  }

  const { columnKey, gridSchema } = params;
  const { primaryColumnKey } = gridSchema.meta;

  return (
    <SubGridToggle
      subGridData={value}
      parentGridId={gridSchema.options.id}
      parentGridCellLocation={{
        rowId: row[primaryColumnKey] as GridRowId,
        columnKey,
      }}
    />
  );
};

export const ujsonValueCellRenderer = (value: UJSONValue) => {
  return encodePretty(value);
};
