import { JsocGridError } from '../errors';
import {
	generateRows,
	type ColumnKey,
	type GridRowId,
	type GridRows,
	type IdColumnKey,
} from '.';
import {
	capitalizeFirst,
	isIndexWithinLength,
	ensureString,
	type PlainObject,
} from '../utils';

/**
 * - Either gridId of the root grid provided by the consumer or
 * - Unique id build by the `buildSubGridId` method to uniquely identify a `GridSchema`
 * 	inside the `GridSchemaStore`.
 */
export type GridId = string;
/**
 * JSON data provided by the consumer
 */
export type GridData = Readonly<PlainObject | Array<PlainObject>>;
/**
 * flag that indicates which GridSchema from the GridSchemaStore is active(rendered) on the UI
 */
export type ActiveGridFlag = boolean;
/**
 * Object that contains the abstract location of a grid cell.
 */
export type GridCellLocation = {
	/**
	 * Value of `IdColumnKey` column in the row that contains this cell.
	 */
	rowId: GridRowId;
	/**
	 * `ColumnKey` which this cell corresponds to.
	 */
	columnKey: ColumnKey;
};

export type GridSchema = {
	gridId: GridId;
	gridRows: GridRows;
	gridIdColumnKey: IdColumnKey;
	isActiveGrid: ActiveGridFlag;
};
/**
 * Array of `GridSchema`s containing details of multiple grids that were opened by the user
 * previously and currently.
 */
export type GridSchemaStore = Array<GridSchema>;
export type GridSchemaStoreIndex = number;

/**
 * Creates a new `GridSchemaStore` based on the provided grid name and data
 * @param gridId id of the root grid
 * @param gridData JSON data of the root grid
 * @returns newly initialised `GridSchemaStore`
 */
export function initGridSchemaStore(
	gridId: GridId,
	gridData: GridData
): GridSchemaStore {
	const { gridRows, gridIdColumnKey } = generateRows(gridData);
	return [
		{
			gridId,
			gridRows,
			gridIdColumnKey,
			isActiveGrid: true,
		},
	];
}

export type BuildSubGridSchemaResult = {
	subGridSchema: GridSchema;
	searchResult: SearchGridSchemaResult;
};
export function buildSubGridSchema(
	gridSchemaStore: GridSchemaStore,
	subGridData: GridData,
	parentGridId: GridId,
	parentGridCellLocation: GridCellLocation
): BuildSubGridSchemaResult {
	const subGridId = buildSubGridId(parentGridId, parentGridCellLocation);
	const searchResult = searchGridSchema(gridSchemaStore, subGridId);

	let subGridSchema: GridSchema;
	if (searchResult.isPresentInStore) {
		// Reusing old value as GridRows are usually stable and only changes when user changes the GridData.
		// As UI Components usually modify the row models (copied values) instead of provided rows.
		// TODO: Meed to check is there any unnoticed scenario when stale values can occur.
		subGridSchema = searchResult.gridSchema;
	} else {
		const { gridRows, gridIdColumnKey } = generateRows(subGridData);

		subGridSchema = {
			gridId: subGridId,
			gridRows,
			gridIdColumnKey,
			isActiveGrid: true,
		};
	}

	return {
		subGridSchema,
		searchResult,
	};
}

/**
 * Separator used by `buildSubGridId` method
 */
export const BUILD_GRID_ID_SEPARATOR = '.';
/**
 * Builds a unique id to uniquely identify a `GridSchema` inside the `GridSchemaStore`.
 * It uses combination of parentGridId and parentGridCellLocation to prevent name conflicts
 * @param gridName name of the subgrid
 * @param parentGridId id of the parent grid
 * @param parentGridRowId row id from which the sub grid is created
 * @returns `GridId`
 */
export function buildSubGridId(
	parentGridId: GridId,
	parentGridCellLocation: GridCellLocation
): GridId {
	const { rowId, columnKey } = parentGridCellLocation;
	const prefix = `${parentGridId}[${rowId}]`;

	return [prefix, columnKey].join(BUILD_GRID_ID_SEPARATOR);
}

export function extractGridNameFromGridId(gridId: GridId) {
	const gridName = gridId.split(BUILD_GRID_ID_SEPARATOR).at(-1);

	return capitalizeFirst(ensureString(gridName));
}

/**
 * Creates a new `GridSchemaStore` by making the `GridSchema` active on the provided
 * `index` of the given `gridSchemaStore`
 * @param gridSchemaStore
 * @param index
 * @returns `GridSchemaStore`
 */
export function activateGridSchema(
	gridSchemaStore: GridSchemaStore,
	index: GridSchemaStoreIndex
): GridSchemaStore {
	const copy = [...gridSchemaStore];
	setActiveGridSchema(copy, index);

	return copy;
}

/**
 * Creates a new `GridSchemaStore` by adding a new schema and activating it in the
 * provided `gridSchemaStore`.
 * @param gridSchemaStore
 * @param subGridId - id of the grid which needs to be added
 * @param subGridData - data of the grid which needs to be added
 */
export function addGridSchema(
	gridSchemaStore: GridSchemaStore,
	subGridId: GridId,
	subGridData: GridData
): GridSchemaStore {
	const { gridRows, gridIdColumnKey } = generateRows(subGridData);
	const gridSchema: GridSchema = {
		gridId: subGridId,
		gridRows,
		gridIdColumnKey,
		isActiveGrid: true,
	};

	const activeIndex = getIndexOfActiveGridSchema(gridSchemaStore);
	const slicedUntilActiveIndex = gridSchemaStore.slice(0, activeIndex + 1); // + 1 is added as end param is exclusive but activeIndex should be included in new store
	const copy = [...slicedUntilActiveIndex, gridSchema]; // add the new item in the last index

	return activateGridSchema(copy, copy.length - 1); // activate the added item
}

/**
 * Creates a new `GridSchemaStore` by removing the gridSchema at the provided `removeIndex`
 * All the sub grids of the grid at removeIndex also get removed, so in case the active grid
 * is one of the sub grids, then new active grid will be set which will be the parent of the
 * grid at removeIndex
 * @param gridSchemaStore
 * @param removeIndex index of the `GridSchema` which needs to removed
 * @returns `GridSchemaStore`
 */
export function removeGridSchema(
	gridSchemaStore: GridSchemaStore,
	removeIndex: GridSchemaStoreIndex
): GridSchemaStore {
	if (removeIndex < 1) {
		throw new JsocGridError('Remove Index must be greater than 0');
	}

	const activeIndex = getIndexOfActiveGridSchema(gridSchemaStore);

	if (removeIndex <= activeIndex) {
		setActiveGridSchema(gridSchemaStore, removeIndex - 1);
	}

	return [...gridSchemaStore.slice(0, removeIndex)];
}

export type SearchGridSchemaResult = {
	isPresentInStore: boolean;
	gridSchemaStoreIndex: GridSchemaStoreIndex;
	gridSchema: GridSchema;
};
/**
 * Returns whether the provided `gridSchema` is present in the `gridSchemaStore`
 * and at what index
 * @param gridSchemaStore
 * @param gridSchema which needs to be searched
 */
export function searchGridSchema(
	gridSchemaStore: GridSchemaStore,
	gridId: GridId
): SearchGridSchemaResult {
	const gridSchemaStoreIndex = gridSchemaStore.findIndex(
		(item) => item.gridId == gridId
	);
	const gridSchema = gridSchemaStore[gridSchemaStoreIndex];

	return {
		isPresentInStore: gridSchemaStoreIndex > -1,
		gridSchemaStoreIndex,
		gridSchema,
	};
}

/**
 * Returns index of the active `gridSchema` in the `gridSchemaStore`
 * @param gridSchemaStore
 */
export function getIndexOfActiveGridSchema(
	gridSchemaStore: GridSchemaStore
): GridSchemaStoreIndex {
	const index = gridSchemaStore.findIndex((item) => item.isActiveGrid);

	if (index != -1) {
		return index;
	} else {
		throw new JsocGridError(
			'Unable to find active item in the GridSchemaStore.'
		);
	}
}

/**
 * Returns the `gridSchema` which is currently active in the `gridSchemaStore`
 * @param gridSchemaStore
 * @returns `GridSchema`
 */
export function getActiveGridSchema(
	gridSchemaStore: GridSchemaStore
): GridSchema {
	return gridSchemaStore[getIndexOfActiveGridSchema(gridSchemaStore)];
}

/**
 * Sets the `gridSchema` as active at the provided `newActiveIndex` of the `gridSchemaStore`
 * @param gridSchemaStore
 */
export function setActiveGridSchema(
	gridSchemaStore: GridSchemaStore,
	newActiveIndex: GridSchemaStoreIndex
): undefined {
	if (isIndexWithinLength(gridSchemaStore, newActiveIndex)) {
		const oldActiveIndex = getIndexOfActiveGridSchema(gridSchemaStore);
		gridSchemaStore[oldActiveIndex].isActiveGrid = false;
		gridSchemaStore[newActiveIndex].isActiveGrid = true;
	} else {
		throw new JsocGridError(
			'New active index is not within the GridSchemaStore length.'
		);
	}
}
