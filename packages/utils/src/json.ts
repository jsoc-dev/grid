import { isArray } from "#array.ts";
import { isBoolean } from "#boolean.ts";
import { isNull, isUndefined } from "#null.ts";
import { isFiniteNumber } from "#number.ts";
import { isPlainObject } from "#object.ts";
import { isString, toStringSafe } from "#string.ts";

/**
 * Type representing a value encoded in a JSON.
 * @see {@link https://chatgpt.com/share/69cd6941-ca88-8320-afa1-e7cc14923a44 About JSON}
 * @see {@link https://github.com/microsoft/TypeScript/pull/33050 About Recursive Types}
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONArray
  | JSONObject;
export type JSONValueOrUndefined = JSONValue | undefined;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };
export type JSONObjectWithUndefined = Record<string, JSONValueOrUndefined>;

/**
 * Recursively validates a value against {@link JSONValue}.
 */
// https://chatgpt.com/share/69ce3b16-e794-8323-9786-f1303624daa4
export function isJSONValue(
  value: unknown,
  allowUndefined: boolean = false,
  seen = new Set<unknown>(),
): value is JSONValue {
  if (
    isNull(value) ||
    (allowUndefined && isUndefined(value)) ||
    isBoolean(value) ||
    isFiniteNumber(value) ||
    isString(value)
  ) {
    return true;
  }

  if (value !== null && typeof value === "object") {
    if (seen.has(value)) {
      return false; // reject cyclic structures
    }

    seen.add(value);

    let result = false;
    if (isArray(value)) {
      result = _isJSONArray(value, allowUndefined, seen);
    } else if (isPlainObject(value)) {
      result = _isJSONObject(value, allowUndefined, seen);
    }

    seen.delete(value); // allow same object refs on different keys
    return result;
  }

  return false;
}

function _isJSONArray(
  value: unknown,
  allowUndefined: boolean,
  seen: Set<unknown>,
): value is JSONArray {
  if (!isArray(value)) return false;

  for (const v of value) {
    if (!isJSONValue(v, allowUndefined, seen)) {
      return false;
    }
  }

  return true;
}

function _isJSONObject(
  value: unknown,
  allowUndefined: boolean,
  seen: Set<unknown>,
): value is JSONObject {
  if (!isPlainObject(value)) return false;

  if (Object.getOwnPropertySymbols(value).length > 0) {
    return false; // reject object with symbol keys
  }

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      continue; // skip inherited properties
    }

    if (!isJSONValue(value[key], allowUndefined, seen)) {
      return false;
    }
  }

  return true;
}

export function isJSONArray(
  value: unknown,
  allowUndefined = false,
): value is JSONArray {
  return _isJSONArray(value, allowUndefined, new Set<unknown>());
}

export function isJSONObject(
  value: unknown,
  allowUndefined = false,
): value is JSONObject {
  return _isJSONObject(value, allowUndefined, new Set<unknown>());
}

/**
 * Replica of native JSON.stringify, but this version fallbacks to casted string
 * instead of throwing error if the value is invalid.
 */
export function encode(value: unknown, space?: string | number): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return toStringSafe(value);
  }
}

export function encodePretty(json: unknown) {
  return encode(json, 2);
}

export function prettyJSON(input: string, space?: string | number) {
  try {
    const { value } = decode(input, false);
    return encode(value, space);
  } catch {
    return toStringSafe(input);
  }
}

export type DecodeResult = { value?: unknown; error?: SyntaxError };
/**
 * Parses a JSON string and returns an object with `value` property containing the parsed value.
 * If provided `json` is invalid and `safe` is true, returns an object with `error` property.
 */
export function decode(json: string, safe: boolean = false): DecodeResult {
  try {
    const value = JSON.parse(json) as unknown;
    return { value };
  } catch (e) {
    if (safe) {
      return { error: e as SyntaxError };
    }
    throw e;
  }
}
