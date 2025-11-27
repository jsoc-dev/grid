import { isNumber, isPlainObject, isString, type PlainObject } from '../';

export const MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

/**
 * Wraps the given value in an array if it is not an array.
 * Note:
 * - Unlike `Array.from()`, this does **not** split strings into characters.
 * - Unlike `Array.of()`, this does **not** wrap an array into a nested array.
 *
 * @example
 * ensureArray(5);          // => [5]
 * ensureArray([5, 6]);     // => [5, 6]
 * ensureArray('abc');      // => ['abc']
 */
export function ensureArray<T>(arg: T | T[]): T[] {
	return Array.isArray(arg) ? arg : [arg];
}

export function joinStringArray(arg: readonly string[]) {
	return arg.map((str) => `"${str}"`).join(', ');
}

export function isArrayIndex(arg: unknown): arg is number {
	return (
		isNumber(arg) &&
		Number.isInteger(arg) &&
		arg >= 0 &&
		arg < MAX_ARRAY_LENGTH
	);
}

export function areAllUnique(arr: unknown[]) {
	return arr.length === new Set(arr).size;
}

export function isIndexWithinLength(
	arr: Array<unknown>,
	index: unknown
): boolean {
	return isArrayIndex(index) && index < arr.length;
}

export function isArrayOfObjects(arg: unknown): arg is Array<PlainObject> {
	return Array.isArray(arg) && arg.every(isPlainObject);
}

export function isArrayOfStrings(arg: unknown): arg is Array<string> {
	return Array.isArray(arg) && arg.every(isString);
}
