import { toStringSafe } from "#string.ts";

/**
 * Type representing a valid JSON value.
 * @see {@link https://github.com/microsoft/TypeScript/pull/33050 Learn more}
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
export type JSONValueOrUndefined = JSONValue | undefined;
export type JSONObject = Record<string, JSONValue>;
export type JSONObjectWithUndefined = Record<string, JSONValueOrUndefined>;

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

export type DecodeResult = { value?: object; error?: SyntaxError };
/*
 * Converts a JSON string into an object.
 * If provided `json` is invalid, returns null.
 */
export function decode(json: string): DecodeResult {
  try {
    const value = JSON.parse(json);
    return { value };
  } catch (e) {
    return { error: e as SyntaxError };
  }
}
