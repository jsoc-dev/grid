import { isNullOrUndefined } from '../';

export function isString(arg: unknown): arg is string {
	return typeof arg === 'string';
}

export function equalsIgnoreCase(str1: string, str2: string): boolean {
	return (
		str1.trim().toLowerCase() ===
		str2.trim().toLowerCase()
	)
}

export function prettyStringify (json: unknown) {
	return JSON.stringify(json, null, 2);
}

export function capitalizeFirst (str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toString(arg: unknown): string {
	return isNullOrUndefined(arg) ? '' : String(arg);
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