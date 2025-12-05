import { useGridSchemaStore } from './useGridSchemaStore';
import {
	type GridId,
	type GridData,
	type GridCellLocation,
	addGridSchema,
	removeGridSchema,
	extractGridNameFromGridId,
	buildSubGridId,
	searchGridSchema,
} from '@jsoc/core/grid';

export function useToggleSubGrid(
	subGridData: GridData,
	parentGridId: GridId,
	parentGridCellLocation: GridCellLocation
) {
	const { gridSchemaStore, setGridSchemaStore } = useGridSchemaStore();
	const subGridId = buildSubGridId(parentGridId, parentGridCellLocation);
	const searchResult = searchGridSchema(gridSchemaStore, subGridId);
	const { isPresentInStore, gridSchemaStoreIndex } = searchResult;

	return {
		isPresentInStore,
		toggleSubGrid,
		toggleText: getToogleText(),
	};

	function getToogleText() {
		const gridName = extractGridNameFromGridId(subGridId);

		return (isPresentInStore ? 'Close ' : 'Open') + ' ' + gridName;
	}

	function toggleSubGrid() {
		const newGridSchemaStore = isPresentInStore
			? removeGridSchema(gridSchemaStore, gridSchemaStoreIndex)
			: addGridSchema(gridSchemaStore, subGridId, subGridData);

		setGridSchemaStore(newGridSchemaStore);
	}
}
