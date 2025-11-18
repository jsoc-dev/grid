import { JsocGridError } from "./JsocGridError";

export class JsocGridDataError extends JsocGridError {
	constructor(public message: string, data: unknown) {
		super(message + ' Data provided to JsocGrid: ' + data);
		this.name = "JsocGridDataError";
	}
}

// sub classes of JsocGridDataError
export class ArrayOfArraysError extends JsocGridDataError {
	constructor(public array: unknown[]) {
		super(`Grid data as array of arrays is not supported.`, array);
	}
}

export class NoObjectInArrayError extends JsocGridDataError {
	constructor(public array: unknown[]) {
		super(`No object elements present in Root Grid Data.`, array);
	}
}

export class NoConcreteObjectInArrayError extends JsocGridDataError {
	constructor(public array: unknown[]) {
		super(`There are 0 concrete object elements in root grid data`, array);
	}
}