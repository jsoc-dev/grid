import { useMemo, useState } from 'react';
import { GridData, GridKey, init } from '@jsoc/core/grid';

export function useGridNavigator(
	gridKey: GridKey,
	gridData: GridData
) {
	const gridSchemaStack = useMemo(
		function () {
			return init(gridKey, gridData);
		},
		[gridData]
	);

	return useState(gridSchemaStack);
}
