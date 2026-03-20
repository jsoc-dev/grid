import type { ColumnKey } from "#column.ts";
import type { GridRows } from "#schema.ts";

import {
  areAllUnique,
  isFunction,
  isNumber,
  isString,
  toStringSafe,
} from "@jsoc/utils";

/**
 * Property that has a unique value for all the `GridRows`.
 */
export type PrimaryColumnKey = ReturnType<typeof getPrimaryColumnKey>;

/**
 * This key is used as a fallback primary column key when the grid rows don't have a primary column.
 *
 * - It consists of a constant prefix and a random suffix (so that it doesn't collide with any property in gridData JSON).
 * Though, it is highly unlikely that any JSON will have a property like the prefix itself, but still it is possible, so we generate a random suffix to be safe.
 *
 * - Suffix is generated here and not inside the component as it can improve performance in
 * React components (assuming that when suffix is generated inside the component, the column key
 * changes on every render, and the renderer might rerender whole column thinking it as different
 * column even if the data didn't changed.
 */
export const FALLBACK_PRIMARY_COLUMN_KEY =
  "__AUTO-GENERATED-PRIMARY-COLUMN__" + randomId();

/**
 * Some grid components require a primary column. For example:
 * - MUI DataGrid throws an error if rows don't have a primary column.
 * "The Data Grid component requires all rows to have a unique `id` property. Alternatively, you can use the `getRowId` prop to specify a custom id."
 * - Whereas AG-Grid checks for "id" key in each row and if not found, it generates one.
 *
 * To make things consistent for all UI components, `getPrimaryColumnKey` method can be used to provide the primary column key to the grid components.
 *
 * - In case, the `plainRows` doesn't have a valid primary column, this method mutates the `plainRows` array by assigning fallback primary column values to each row.
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

export function isFallbackPrimaryColumn(columnKey: ColumnKey) {
  return columnKey === FALLBACK_PRIMARY_COLUMN_KEY;
}

export function randomId(): string {
  // `crypto.randomUUID` requires a secure context like https://example.com or http://localhost
  // It is not available in http://example.com  or http://192.168.x.x
  if (isFunction(crypto.randomUUID)) {
    return crypto.randomUUID();
  }

  // temporary workaround
  return ("" + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16),
  );
}
