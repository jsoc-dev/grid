import { GridError } from "#helpers/errors.ts";
import type { GridRow, GridRows } from "#types/rows.ts";
import type { GridDataReadonly } from "#types/schema.ts";

import { ensureArray, isString, isUJSONObject } from "@jsoc/utils";

/**
 * Generates {@link GridRows} from the provided {@link GridDataReadonly}.
 * @throws a {@link GridError} if the `data` cannot be normalized.
 */
export function generateRows(data: GridDataReadonly): GridRows {
  const dataArray = normalizeData(data);
  const validRows: GridRow[] = [];
  const invalidRows: unknown[] = [];

  for (const row of dataArray) {
    if (isUJSONObject(row)) {
      validRows.push(row);
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

  return validRows;
}

/**
 * Normalizes the grid data into an array of objects
 */
function normalizeData(data: GridDataReadonly): unknown[] {
  let unknownData: unknown;

  try {
    if (isString(data)) {
      unknownData = JSON.parse(data) as unknown;
    } else {
      unknownData = structuredClone(data);
    }
  } catch (e) {
    throw new GridError("Error occured while normalizing grid data.", e);
  }

  return ensureArray(unknownData);
}
