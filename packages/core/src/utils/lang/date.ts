import { isString } from '../';

const ISO_REGEX =
	/^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

export function isConvertibleToDate(arg: unknown): boolean {
	if (
		!isString(arg) ||
		!isNaN(Number(arg)) || // Reject numeric-only strings like "01082002"
		!ISO_REGEX.test(arg) // added guard to prevent values like "Apt. 556" as Date.parse forcefully parse even some invalid strings like "Apt. 556" to timestamps
	) {
		return false;
	}

	const timestamp = Date.parse(arg);
	return !isNaN(timestamp);
}
