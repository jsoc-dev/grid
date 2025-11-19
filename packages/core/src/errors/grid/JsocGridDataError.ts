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


export class NoRowsInRootGridDataError extends JsocGridDataError {
	constructor(public array: unknown[]) {
		super(`Found 0 rows in root grid data. Note: An object with atleast one key is referred as a row.`, array);
	}
}