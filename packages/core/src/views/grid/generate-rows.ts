import { ensureArray, isPlainObject, PlainObject } from '../../util';
import { GridData } from './grid-init';

export type GridPlainRows = Array<PlainObject>

export function generateRows(gridData: GridData) {
	return ensureArray(gridData).filter(isPlainObject);
}
