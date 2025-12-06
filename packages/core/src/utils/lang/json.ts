import { toStringSafe } from './string';

export const safeStringify: typeof JSON.stringify = function (
	value,
	replacer?,
	space?
) {
	try {
		return JSON.stringify(value, replacer as any, space as any);
	} catch {
		return toStringSafe(value);
	}
};

export function prettyStringify(json: unknown) {
	return safeStringify(json, null, 2);
}
