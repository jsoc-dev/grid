export function isNull(arg: unknown): arg is null {
	return arg === null;
}

export function isUndefined(arg: unknown): arg is undefined {
	return arg === undefined;
}

export function isDefined<T>(arg: T): arg is Exclude<T, undefined> {
  	return arg !== undefined;
}

export function isNullOrUndefined(arg: unknown): arg is null | undefined {
	return isNull(arg) || isUndefined(arg);
}