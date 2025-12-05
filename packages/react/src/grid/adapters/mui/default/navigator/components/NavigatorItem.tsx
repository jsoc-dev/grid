import { useHidePopperDom } from '../../../hooks';
import { useGridNavigator } from '../../../../../hooks';
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
				title={gridId} // TODO: use better title as gridId is not user friendly
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
