export function isSymbol(arg: unknown): arg is symbol {
	return typeof arg === 'symbol';
}

export function trimSymbol(arg: symbol): string {
	return String(arg).replace(/^Symbol\((.*)\)$/, '$1');
}