import { isArray, isJSONArray, isJSONObject, isJSONValue } from "@jsoc/utils";

/**
 * Type representing an arbitrary JSON structure which includes undefined values.
 */
export type UJSONValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | UJSONArray
  | UJSONObject;
/**
 * Type representing a valid JSON array with undefined values.
 */
export type UJSONArray = UJSONValue[];
/**
 * Type representing a valid JSON object with undefined values.
 */
export type UJSONObject = { [key: string]: UJSONValue };
/**
 * Type representing a valid JSON object array with undefined values.
 */
export type UJSONObjectArray = UJSONObject[];

/**
 * Recursively validates a value against {@link UJSONValue}.
 */
export function isUJSONValue(value: unknown): value is UJSONValue {
  return isJSONValue(value, true);
}

export function isUJSONArray(value: unknown): value is UJSONArray {
  return isJSONArray(value, true);
}

export function isUJSONObject(value: unknown): value is UJSONObject {
  return isJSONObject(value, true);
}

export function isUJSONObjectArray(value: unknown): value is UJSONObjectArray {
  if (!isArray(value)) {
    return false;
  }

  return value.every(isUJSONObject);
}
