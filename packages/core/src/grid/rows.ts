import {
	areAllUnique,
	ensureArray,
	isConcreteObject,
	isNumber,
	isPlainObject,
	isString,
} from '../utils';
import {
	type GridData,
	type GridPlainRows,
	type PrimaryColumnKey,
	FALLBACK_PRIMARY_COLUMN_KEY,
} from './';

/**
 * Returns an object containing:
 * - `rows` - `GridPlainRows` generated from the given `gridData`
 * - `primaryColumnKey` - resolved from the generated `GridPlainRows`
 * @param gridData JSON data received from the consumer
 */
export function generateRows(gridData: GridData): {
	gridPlainRows: GridPlainRows;
	gridPrimaryColumnKey: PrimaryColumnKey;
} {
	const gridDataCopy = structuredClone(gridData);
	let gridPlainRows = ensureArray(gridDataCopy).filter(
		(row) => isPlainObject(row) && isConcreteObject(row)
	);
	let gridPrimaryColumnKey: PrimaryColumnKey;

	if (isIdEligibleForPrimaryColumn(gridPlainRows)) {
		gridPrimaryColumnKey = 'id';
	} else {
		gridPrimaryColumnKey = FALLBACK_PRIMARY_COLUMN_KEY;
		gridPlainRows = assignFallbackPrimaryColumnValues(gridPlainRows);
	}

	return {
		gridPlainRows,
		gridPrimaryColumnKey,
	};
}

function isIdEligibleForPrimaryColumn(plainRows: GridPlainRows): boolean {
	const isIdValidInEachRow = plainRows.every(
		(row) => isString(row.id) || isNumber(row.id)
	);
	const isIdUniqueInEachRow = areAllUnique(plainRows.map((row) => row.id));

	return isIdValidInEachRow && isIdUniqueInEachRow;
}

function assignFallbackPrimaryColumnValues(
	plainRows: GridPlainRows
): GridPlainRows {
	const updatedRows = plainRows.map((row, index) => ({
		...row,
		[FALLBACK_PRIMARY_COLUMN_KEY]: index,
	}));

	return updatedRows;
}
