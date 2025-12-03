import {
	getIndexOfActiveGridSchema,
	type GridSchemaStore,
} from '@jsoc/core/grid';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useContext, useEffect } from 'react';
import type { DataGridCommunityApiRef } from '../JsocGridMui';
import { useGridSchemaStore } from '../../../hooks';

/**
 * This hook reapply the focus to the grid cell from which the subgrid was opened previosly.
 */
export function useRestoreGridParentFocus(
	apiRef: DataGridCommunityApiRef,
	gridSchemaStore: GridSchemaStore
) {
	useEffect(
		function () {
			if (apiRef.current && gridSchemaStore) {
				restoreGridParentFocus(apiRef.current, gridSchemaStore);
			}
		},
		[gridSchemaStore]
	);
}

export function restoreGridParentFocus(
	api: GridApiCommunity,
	gridSchemaStore: GridSchemaStore
) {
	const activeIndex = getIndexOfActiveGridSchema(gridSchemaStore);
	const subGridSchema = gridSchemaStore[activeIndex + 1];

	if (subGridSchema) {
		const { gridName: subGridName, gridParent } = subGridSchema;
		const { rowId } = gridParent!;

		const rowIndex = api.getRowIndexRelativeToVisibleRows(rowId);
		const colIndex = api.getColumnIndex(subGridName);

		api.selectRow(rowId);
		api.setCellFocus(rowId, subGridName);

		requestAnimationFrame(() => {
			/**
			 * Note:
			 * - `selectRow` and `setCellFocus` update the row model immediately,
			 *   but `scrollToIndexes` performs a DOM-based scroll action.
			 * - When this effect runs, the virtual scroller element may not yet be mounted,
			 *   so calling `scrollToIndexes` too early results in no scrolling.
			 *
			 * We are unable to find a reliable MUI DataGrid event that guarantees the scroller is attached to the DOM
			 * at this exact moment, so we are deferring the `scrollToIndexes` call using `requestAnimationFrame`,
			 * which ensures the scroll action runs on the next paint frame, assuming that the scroll element is
			 * also batched to render in the next paint cycle.
			 */
			api.scrollToIndexes({ rowIndex, colIndex });
		});
	}
}
