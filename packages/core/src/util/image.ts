import { isString } from './string';

export function joinImageOrStringValues(value: unknown[]) {
	if (value.some((x) => isImageLink(x))) {
		return value.map((x) => getImageHtmlString(x)).join(' ');
	}
	return value.filter((v) => isString(v) && v.length).join(', ');
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

export function getImageHtmlString(url: unknown) {
	if (!isString(url)) {
		return '';
	}

	return `<img height="20" onerror="this.src='resources/shared/images/icons/profilethumb.jpg'" style="border-radius:100px; width:24px; height:24px; background:#e4e6e7" src="${url}" >`;
}
