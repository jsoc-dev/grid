import { isPlainObject } from "#object/object.ts";

/**
 * Shallow-compares two objects by their enumerable own keys.
 * Returns true if all keys and their values are the same (using Object.is).
 *
 * @example
 * const stable = { page: 1, total: 10 };
 * // true, because both objects have same keys and Object.is-equal values.
 * shallowEqual(stable, { page: 1, total: 10 });
 *
 * @example
 * const prev = { filters: { status: "active" }, page: 1 };
 * const next = { filters: { status: "active" }, page: 1 };
 * // false, because `filters` object reference changed.
 * shallowEqual(prev, next);
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
  if (!isPlainObject(a) || !isPlainObject(b)) {
    return Object.is(a, b);
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    return Object.hasOwn(b, key) && Object.is(a[key], b[key]);
  });
}
