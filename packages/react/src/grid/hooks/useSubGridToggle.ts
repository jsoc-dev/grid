import { JsocGridContext } from '../wrapper/JsocGrid';
import { capitalizeFirst } from '@jsoc/core';
import {
	GridSchema,
	upsertGridSchema,
	searchGridSchema,
	removeGridSchema,
	type SearchGridSchemaResult,
	type GridSchemaStore,
	extractGridNameFromGridId,
} from '@jsoc/core/grid';
import { useContext } from 'react';

export function useSubGridToggle(
	subGridSchema: GridSchema,
	searchResult: SearchGridSchemaResult
) {
	const { gridSchemaStore, setGridSchemaStore } = useContext(JsocGridContext);
	const { isPresentInStore, gridSchemaStoreIndex } = searchResult;
	const { gridId } = subGridSchema;
	const gridName = extractGridNameFromGridId(gridId);
	const text =
		(isPresentInStore ? 'Close ' : 'Open') +
		' ' +
		capitalizeFirst(gridName);

	return {
		text,
		toggle,
	};

	function toggle() {
		if (isPresentInStore) {
			setGridSchemaStore(
				removeGridSchema(gridSchemaStore, gridSchemaStoreIndex)
			);
		} else {
			setGridSchemaStore(
				upsertGridSchema(gridSchemaStore, subGridSchema, searchResult)
			);
		}
	}
}
