import { isConcreteObject, isPlainObject } from '../../util/object';
import { ensureArray } from '../../util/array';
import { isString, parseString } from '../../util/string';
import {
	ArrayOfArraysError,
	NoConcreteObjectInArrayError,
	NoObjectInArrayError,
} from '../../errors';
import { JsocData } from '@jsoc/react';
import {
	GridNavigatorStack,
	GridNavigatorStackItem,
} from 'packages/react/src/views/grid/JsocGridContext';
import { isConvertibleToDate } from '../../util';

// TYPES
export type GridKey = string | symbol;
export type GridData = Record<string, unknown>[];
export type ColumnKey = string;
export type ColumnId = ColumnKey;
export type ColumnType = 'string' | 'date' | 'nested';
export type ColumnSchema = {
	id: ColumnId;
	type: ColumnType;
};
export type ColumnGenerator<C> = (id: ColumnKey) => C;
export type ColumnFactory<C> = Record<ColumnType, ColumnGenerator<C>>;

// VARIABLES
export const DEFAULT_ROOT_GRID_KEY = 'All Data';
export function getRootGrid(data: JsocData): GridNavigatorStackItem {
	const { rootGridKey, rootGridData } = getRootGridSchema(data);
	return {
		gridKey: rootGridKey,
		gridData: rootGridData,
	};
}

function getRootGridSchema(data: unknown) {
	let tempKey: GridKey = Symbol(DEFAULT_ROOT_GRID_KEY);
	let tempData: unknown = data;

	if (isString(data)) {
		tempData = parseString(data);
	}

	if (isPlainObject(data)) {
		const resultKeys = Object.keys(data);
		const resultFirstKey = resultKeys[0];
		const resultFirstValue = data[resultFirstKey];
		if (resultKeys.length === 1 && isPlainObject(resultFirstValue)) {
			tempKey = resultFirstKey;
			tempData = resultFirstValue;
		}
	}

	const tempDataArr = ensureArray(tempData);
	validateRootGridData(tempDataArr);

	return {
		rootGridKey: tempKey,
		rootGridData: tempDataArr,
	};
}

function validateRootGridData(data: unknown[]): asserts data is GridData {
	if (data.some(Array.isArray)) {
		throw new ArrayOfArraysError(data);
	} else if (data.every(isPlainObject)) {
		// all elements in rootData are object
	} else if (data.some(isPlainObject)) {
		// some elements in rootData are object
		console.warn(
			'Not all elements in Root Grid data are objects. Non object elements are ignored.'
		);
	} else {
		throw new NoObjectInArrayError(data);
	}

	// now, rootData is an array containg atleast one object element
	if (data.some((x) => isPlainObject(x) && isConcreteObject(x))) {
		// now, there is atleast one concrete object element in rootData array
	} else {
		throw new NoConcreteObjectInArrayError(data);
	}
}

export function generateColumns<C>(
	gridData: GridData,
	columnGeneratorStore: ColumnFactory<C>
): C[] {
	return transformColumnSchemas(
		generateColumnsSchema(gridData),
		columnGeneratorStore
	);
}

export function generateColumnsSchema(gridData: GridData): ColumnSchema[] {
	const columnList: Array<ColumnKey> = [];
	for (const row of gridData) {
		for (const rowColumn of Object.keys(row)) {
			if (!columnList.includes(rowColumn)) {
				columnList.push(rowColumn);
			}
		}
	}

	const columnSchemaList: Array<ColumnSchema> = [];

	for (const key of columnList) {
		// TODO: add helper for boolean values,
		if (isExpandableData(gridData)) {
			columnSchemaList.push({
				id: key,
				type: 'nested',
			});
		} else if (gridData.some(isConvertibleToDate)) {
			columnSchemaList.push({
				id: key,
				type: 'date',
			});
		} else {
			columnSchemaList.push({
				id: key,
				type: 'string',
			});
		}
	}

	return columnSchemaList;
}

export function transformColumnSchemas<C>(
	columnSchemas: ColumnSchema[],
	columnGeneratorStore: ColumnFactory<C>
): C[] {
	return columnSchemas.map(({ id, type }) => columnGeneratorStore[type](id));
}

function isExpandableData(data: GridData) {
	return (
		data.some((x) => isPlainObject(x)) ||
		data.some((x) => Array.isArray(x) && x.some((y) => isPlainObject(y)))
	);
}
