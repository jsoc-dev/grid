import { useGridSchemaStore } from './useGridSchemaStore';
import {
	type GridId,
	type GridDataReadonly,
	type GridCellLocation,
	addGridSchema,
	removeGridSchema,
	extractGridNameFromGridId,
	buildSubGridId,
	searchGridSchema,
} from '@jsoc/core/grid';

export function useToggleSubGrid(
	subGridData: GridDataReadonly,
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
		const toggleText = (isPresentInStore ? 'Close' : 'Open') + ' ' + gridName;
		
		return toggleText;
	}

	function toggleSubGrid() {
		const newGridSchemaStore = isPresentInStore
			? removeGridSchema(gridSchemaStore, gridSchemaStoreIndex)
			: addGridSchema(gridSchemaStore, subGridId, subGridData);

		setGridSchemaStore(newGridSchemaStore);
	}
}
