import { useGridNavigator } from '@/grid';
import { capitalizeFirst } from '@jsoc/core';
import type { GridSchemaStoreIndex } from '@jsoc/core/grid';
import { Chip, Tooltip } from '@mui/material';

type NavigatorItemProps = {
	index: GridSchemaStoreIndex;
};
export function DefaultNavigatorItemMui({ index }: NavigatorItemProps) {
	const { gridSchema, activateGrid, removeGrid } = useGridNavigator(index);
	const { gridName, gridData, gridParent, isActiveGrid } = gridSchema;
	const tooltip = capitalizeFirst(gridName);

	return (
		<>
			<Tooltip title={tooltip}>
				<Chip
					label={capitalizeFirst(gridName)}
					// size='small'
					// variant={isActiveGrid ? 'filled' : 'outlined'}
					color={isActiveGrid ? 'primary' : 'default'}
					clickable={!isActiveGrid}
					aria-pressed={isActiveGrid}
					onClick={activateGrid}
					onDelete={removeGrid}
					sx={{ maxWidth: 120 }}
				/>
			</Tooltip>
		</>
	);
}
