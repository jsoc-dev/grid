import type {
  ColumnDataType,
  ColumnDataTypeResolverMethod,
} from "#types/column.ts";

import {
  isBoolean,
  isISODateString,
  isNumber,
  isString,
  isUJSONObject,
  isUJSONObjectArray,
} from "@jsoc/utils";

export const COLUMN_DATA_TYPES: {
  [K in ColumnDataType]: K;
} = {
  boolean: "boolean",
  number: "number",
  string: "string",
  stringDate: "stringDate",
  ujsonObject: "ujsonObject",
  ujsonObjectArray: "ujsonObjectArray",
  ujsonValue: "ujsonValue",
} as const;

/**
 * Sequential list of {@link ColumnDataTypeResolverMethod}s used to determine each
 * {@link ColumnDataType}.
 */
export const COLUMN_DATA_TYPE_SEQUENTIAL_RESOLVERS: ColumnDataTypeResolverMethod[] =
  [
    (cv) => cv.every(isBoolean) && COLUMN_DATA_TYPES.boolean,
    (cv) => cv.every(isNumber) && COLUMN_DATA_TYPES.number,
    (cv) => cv.every(isUJSONObject) && COLUMN_DATA_TYPES.ujsonObject,
    (cv) => cv.every(isUJSONObjectArray) && COLUMN_DATA_TYPES.ujsonObjectArray,
    (cv) => cv.every(isISODateString) && COLUMN_DATA_TYPES.stringDate, // DO NOT PLACE THIS BELOW string resolver as it will resolve all date strings as string
    (cv) => cv.every(isString) && COLUMN_DATA_TYPES.string,
  ] as const;

/**
 * Default name that is used if the consumer didn't provide any name for the the root grid.
 */
export const DEFAULT_ROOT_GRID_NAME = "Grid";

/**
 * Key used as a fallback {@link PrimaryColumnKey} when no natural primary column exists on the
 * {@link GridRows}.
 * - It consists of a constant prefix and a random suffix (so that it doesn't collide with any property in gridData JSON).
 * - Though, it is highly unlikely that any JSON will have a property like the prefix itself, but still it is possible, so we generate a random suffix to be safe.
 */
export const FALLBACK_PRIMARY_COLUMN_KEY =
  "__AUTO-GENERATED-PRIMARY-COLUMN__" + randomSuffix();

/**
 * Produces a short unique suffix for the fallback column key.
 */
function randomSuffix(): string {
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
