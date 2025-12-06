export function isBoolean(arg: unknown): arg is boolean {
	return typeof arg === 'boolean';
}

export function toBoolIcon(bool: boolean): string {
	return bool == true ? '✓' : '✗';
}
