import type { ColumnKey } from "#column.ts";
import type { GridRows } from "#rows.ts";

import { areAllUnique, isNumber, isString, toStringSafe } from "@jsoc/utils";

/**
 * Property that has a unique value for all the {@link GridRows}.
 * Derived from {@link getPrimaryColumnKey}.
 */
export type PrimaryColumnKey = ReturnType<typeof getPrimaryColumnKey>;

/**
 * Key used as a fallback {@link PrimaryColumnKey} when no natural primary column exists on the
 * {@link GridRows}.
 * - It consists of a constant prefix and a random suffix (so that it doesn't collide with any property in gridData JSON).
 * - Though, it is highly unlikely that any JSON will have a property like the prefix itself, but still it is possible, so we generate a random suffix to be safe.
 */
export const FALLBACK_PRIMARY_COLUMN_KEY =
  "__AUTO-GENERATED-PRIMARY-COLUMN__" + randomId();

/**
 * Resolves the {@link PrimaryColumnKey} for the supplied {@link GridRows}. When an `id` column is
 * already unique it is reused; otherwise, the method mutates `plainRows` to append
 * {@link FALLBACK_PRIMARY_COLUMN_KEY} identifiers.
 */
export function getPrimaryColumnKey(plainRows: GridRows) {
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

/**
 * Produces a short unique suffix for the fallback column key.
 */
export function randomId(): string {
  // `crypto.randomUUID` requires a secure context like https://example.com or http://localhost
  // It is not available in http://example.com  or http://192.168.x.x
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // temporary workaround
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // RFC4122 v4 adjustments
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
