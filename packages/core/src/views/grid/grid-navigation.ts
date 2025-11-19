import { JsocError } from '../../errors/jsoc/JsocError';
import { isArrayIndex, isString, isSymbol } from '../../util';
import { GridData, GridKey } from './grid-init';

export type GridSchema = {
	gridKey: GridKey;
	gridData: GridData;
	isActiveGrid: boolean;
};
export type GridSchemaStack = GridSchema[];

export function getIndex(stack: GridSchemaStack, gridKey: GridKey): number {
	const index = stack.findIndex(
		(gridSchema) => gridSchema.gridKey === gridKey
	);
	if (index != -1) {
		return index;
	} else {
		throw new JsocError('unexpec');
	}
}

export function getActive(stack: GridSchemaStack): GridSchema {
	const current = stack.find((gridSchema) => gridSchema.isActiveGrid);
	if (current) {
		return current;
	} else {
		throw new JsocError('unexpec');
	}
}

export function getActiveIndex(stack: GridSchemaStack): number {
	const currentIndex = stack.findIndex(
		(gridSchema) => gridSchema.isActiveGrid
	);
	if (currentIndex != -1) {
		return currentIndex;
	} else {
		throw new JsocError('unexpec');
	}
}

export function setActive(
	stack: GridSchemaStack,
	gridKey: GridKey
): GridSchemaStack {
	const updatedStack = [...stack];
	setMassInactive(updatedStack, gridKey);
	return updatedStack;
}

export function setMassInactive(
	stack: GridSchemaStack,
	except: GridKey | number
) {
	for (let i = 0; i < stack.length; i++) {
		const gridSchema = stack[i];
		if (isString(except) || isSymbol(except)) {
			gridSchema.isActiveGrid = gridSchema.gridKey === except;
		} else if (isArrayIndex(except)) {
			gridSchema.isActiveGrid = i === except;
		} else {
			throw new JsocError('unexpec');
		}
	}
}

export function push(
	stack: GridSchemaStack,
	gridSchemaNew: GridSchema
): GridSchemaStack {
	const activeIndex = getActiveIndex(stack);
	const updatedStack = [...stack.slice(0, activeIndex + 1), gridSchemaNew];
	setMassInactive(updatedStack, gridSchemaNew.gridKey);

	return updatedStack;
}

export function remove(
	stack: GridSchemaStack,
	gridKey: GridKey
): GridSchemaStack {
	const toDeleteIndex = getIndex(stack, gridKey);
	const activeIndex = getActiveIndex(stack);
	if (toDeleteIndex <= 0) {
		throw new JsocError('unexpec - should never happen');
	}

	if (toDeleteIndex <= activeIndex) {
		setMassInactive(stack, toDeleteIndex - 1);
	}

	return [...stack.slice(0, toDeleteIndex)];
}
