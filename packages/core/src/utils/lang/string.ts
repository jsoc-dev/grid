import { isNullOrUndefined } from '../';

export function isString(arg: unknown): arg is string {
	return typeof arg === 'string';
}

export function ensureString(arg: unknown): string {
	return isNullOrUndefined(arg) ? '' : toStringSafe(arg);
}

/**
 * Converts a value to string without throwing any error.
 * Native String() can throw in very rare scenarios like below:
 * ```
 * const obj = {
 * 	toString() {
 * 		throw new Error("fail");
 * 	}
 * };
 *
 * String(obj); // throws Error("fail")
 * ```
 */
export function toStringSafe(arg: unknown): string {
	try {
		return String(arg);
	} catch (e) {
		return '';
	}
}

export function equalsIgnoreCase(str1: string, str2: string): boolean {
	return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}

export function capitalizeFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toReadableString(str: string): string {
	return str
		// split before capital letter that is followed by lowercase (API stays API)
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		// uppercase first word
		.replace(/^./, c => c.toUpperCase());
}

export function isImageLink(url: unknown) {
	if (
		!isString(url) ||
		!['.jpg', '.jpeg', '.png', '.webp'].some((extn) =>
			url.toLowerCase().endsWith(extn)
		)
	) {
		return false;
	}
	try {
		new URL(url); // Attempt to construct a URL object
		return true;
	} catch (e) {
		return false;
	}
}
