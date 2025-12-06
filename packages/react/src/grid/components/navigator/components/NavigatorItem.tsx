import { useGridNavigator } from '../../../hooks';
import {
	extractGridNameFromGridId,
	type GridSchemaStoreIndex,
} from '@jsoc/core/grid';
import { Chip, Tooltip } from '@mui/material';

type NavigatorItemProps = {
	index: GridSchemaStoreIndex;
};
export function DefaultNavigatorItemMui({ index }: NavigatorItemProps) {
	const { gridSchema, activateGrid, removeGrid } = useGridNavigator(index);
	const { gridId, isActiveGrid } = gridSchema;
	const gridName = extractGridNameFromGridId(gridId);
	const { popperHide, popperRef } = useHidePopperDom();

	return (
		<>
			<Tooltip
				title={gridId} // CANDO: use better title as gridId is not user friendly
				slotProps={{
					popper: { popperRef },
				}}
			>
				<Chip
					label={gridName}
					// size='small'
					// variant={isActiveGrid ? 'filled' : 'outlined'}
					color={isActiveGrid ? 'primary' : 'default'}
					clickable={!isActiveGrid}
					aria-pressed={isActiveGrid}
					onClick={() => {
						popperHide();
						activateGrid();
					}}
					onDelete={removeGrid}
					sx={{ maxWidth: 120 }}
				/>
			</Tooltip>
		</>
	);
}

import { useRef } from 'react';
// TODO: Remove this and use a proper solution
export function useHidePopperDom() {
	const popperRef = useRef(null);

	function popperHide() {
		const popperRefCurr = popperRef.current as any;
		if (popperRefCurr?.state?.elements?.popper?.style) {
			popperRefCurr.state.elements.popper.style.display = 'none';
		}
	}

	return {
		popperRef,
		popperHide,
	};
}
