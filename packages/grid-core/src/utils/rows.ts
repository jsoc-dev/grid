import { GridCoreError } from "#internals/GridCoreError.ts";
import type { PrimaryColumnKey } from "#types/column.ts";
import type { GridRow, GridRowId, GridRows } from "#types/rows.ts";
import type { GridData } from "#types/schema.ts";
import { assignPrimaryColumnKey } from "#utils/primary-column.ts";

import { decode, ensureArray, isString, isUJSONObject } from "@jsoc/utils";

/**
 * Result of {@link generateRows}: normalized rows, their primary key, and a row-id index.
 */
export type GenerateRowsResult = {
  rows: GridRows;
  primaryColumnKey: PrimaryColumnKey;
  rowsById: ReadonlyMap<GridRowId, GridRow>;
};

export function generateRows(data: GridData): GenerateRowsResult {
  const dataArray = normalizeData(data);
  const rows: GridRows = [];
  const invalidRows: unknown[] = [];

  for (const row of dataArray) {
    if (isUJSONObject(row)) {
      rows.push(row);
    } else {
      invalidRows.push(row);
    }
  }

  if (invalidRows.length) {
    console.warn(
      `Found ${invalidRows.length} invalid rows in provided data. The rows will be ignored.`,
      invalidRows,
    );
  }

  const primaryColumnKey = assignPrimaryColumnKey(rows);
  const rowsById = new Map<GridRowId, GridRows[number]>();

  for (const row of rows) {
    rowsById.set(getRowIdString(row, primaryColumnKey), row);
  }

  return { rows, primaryColumnKey, rowsById };
}

export function normalizeData(data: GridData): unknown[] {
  let unknownData: unknown;

  if (isString(data)) {
    const { value, error } = decode(data);
    if (error) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#exceptions
      throw new GridCoreError(
        "Error occured while parsing the data. Please ensure the provided string is a valid JSON.",
        error,
      );
    }
    unknownData = value;
  } else {
    try {
      unknownData = structuredClone(data);
    } catch (e) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone#exceptions
      throw new GridCoreError(
        "Error occured while cloning the data. Please ensure the provided data is serializable.",
        e,
      );
    }
  }

  return ensureArray(unknownData);
}

export function getRowIdString(
  row: GridRow,
  primaryColumnKey: PrimaryColumnKey,
): string {
  return String(row[primaryColumnKey] as GridRowId);
}
