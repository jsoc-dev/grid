import { useGridSchemaStore } from '@/grid';
import { GridSchemaStoreIndex, removeGridSchema, activateGridSchema } from '@jsoc/core/grid';

export function useGridNavigator(index: GridSchemaStoreIndex) {
	const { gridSchemaStore, setGridSchemaStore } = useGridSchemaStore();
	const gridSchema = gridSchemaStore[index];

	return {
		gridSchema,
		gridSchemaStore,
		activateGrid,
		removeGrid,
	};

	function activateGrid() {
		setGridSchemaStore(activateGridSchema(gridSchemaStore, index));
	}

	function removeGrid() {
		setGridSchemaStore(removeGridSchema(gridSchemaStore, index));
	}
}
