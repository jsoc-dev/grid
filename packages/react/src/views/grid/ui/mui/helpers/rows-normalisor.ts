import { GridRowsProp } from "@mui/x-data-grid";
import { GridData, isPlainObject } from "@jsoc/core";

export function normaliseRows(gridData: GridData): GridRowsProp {
	return gridData.filter(isPlainObject).map(ensureRowHasId);
}

function ensureRowHasId(row: Record<PropertyKey, unknown>, index: number) {
	if (!('id' in row)) {
		row.id = crypto.randomUUID();
	}

	return row;
}
