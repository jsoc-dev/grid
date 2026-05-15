import type { ColumnKey, PrimaryColumnKey } from "#types/column.ts";
import type { GridRows } from "#types/rows.ts";

import { areAllUnique, isNumber, isString, toStringSafe, uuid } from "@jsoc/utils";

/**
 * Key used as a fallback {@link PrimaryColumnKey} when no natural primary column exists on the
 * {@link GridRows}.
 * - It consists of a constant prefix and a random suffix (so that it doesn't collide with any property in gridData JSON).
 * - Though, it is highly unlikely that any JSON will have a property like the prefix itself, but still it is possible, so we generate a random suffix to be safe.
 */
const FALLBACK_PRIMARY_COLUMN_KEY =
  "__AUTO-GENERATED-PRIMARY-COLUMN__" + uuid();

/**
 * Resolves the {@link PrimaryColumnKey} for the supplied {@link GridRows}. When an `id` column is
 * already unique it is reused; otherwise, the method mutates `plainRows` to append
 * {@link FALLBACK_PRIMARY_COLUMN_KEY} identifiers.
 */
export function assignPrimaryColumnKey(plainRows: GridRows): PrimaryColumnKey {
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
 * Returns whether a column key is the key of the fallback primary column.
 */
export function isFallbackPrimaryColumn(columnKey: ColumnKey) {
  return columnKey === FALLBACK_PRIMARY_COLUMN_KEY;
}

