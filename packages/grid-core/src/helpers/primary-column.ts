import { FALLBACK_PRIMARY_COLUMN_KEY } from "#constants.ts";
import type { ColumnKey, PrimaryColumnKey } from "#types/column.ts";
import type { GridRows } from "#types/rows.ts";

import { areAllUnique, isNumber, isString, toStringSafe } from "@jsoc/utils";

/**
 * Resolves the {@link PrimaryColumnKey} for the supplied {@link GridRows}. When an `id` column is
 * already unique it is reused; otherwise, the method mutates `plainRows` to append
 * {@link FALLBACK_PRIMARY_COLUMN_KEY} identifiers.
 */
export function getPrimaryColumnKey(plainRows: GridRows): PrimaryColumnKey {
  // Check if 'id' is a valid primary column key
  if (
    plainRows.every((row) => isString(row.id) || isNumber(row.id)) &&
    areAllUnique(plainRows.map((row) => row.id))
  ) {
    return "id";
  }

  // Generate fallback primary column
  for (let i = 0; i < plainRows.length; i++) {
    plainRows[i][FALLBACK_PRIMARY_COLUMN_KEY] = toStringSafe(i);
  }

  return FALLBACK_PRIMARY_COLUMN_KEY;
}

/**
 * Returns whether a column key is the fallback generated column.
 */
export function isFallbackPrimaryColumn(columnKey: ColumnKey) {
  return columnKey === FALLBACK_PRIMARY_COLUMN_KEY;
}
