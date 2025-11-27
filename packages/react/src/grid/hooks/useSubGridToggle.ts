import { JsocGridContext } from '@/grid';
import { capitalizeFirst } from '@jsoc/core';
import { GridSchema, upsertGridSchema, searchGridSchema, removeGridSchema } from '@jsoc/core/grid';
import { useContext } from 'react';

export function useSubGridToggle(subGridSchema: GridSchema) {
	const { gridSchemaStore, setGridSchemaStore } = useContext(JsocGridContext);
	const {isPresentInStore, presentIndex} = searchGridSchema(gridSchemaStore, subGridSchema);
	const { gridName } = subGridSchema;
	const text = (isPresentInStore ? "Close " : "Open") + " " + capitalizeFirst(gridName);
	
	return {
		isPresentInStore,
		presentIndex,
		text,
		toggle
	}

	function toggle() {
		if (isPresentInStore) {
			setGridSchemaStore(removeGridSchema(gridSchemaStore, presentIndex));
		} else {
			setGridSchemaStore(upsertGridSchema(gridSchemaStore, subGridSchema));
		}
	}
}
