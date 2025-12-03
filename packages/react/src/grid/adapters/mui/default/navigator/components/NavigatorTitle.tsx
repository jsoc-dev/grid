import { useGridNavigator } from '../../../../../hooks/useGridNavigator';
import { capitalizeFirst } from "@jsoc/core";
import type { GridSchemaStoreIndex } from "@jsoc/core/grid";
import { Typography } from "@mui/material";

type GridTitleProps = {
	index: GridSchemaStoreIndex;
};
export function DefaultNavigatorTitleMui({ index }: GridTitleProps) {
	const { gridSchema, gridSchemaStore, activateGrid } = useGridNavigator(index);
	const { gridName, gridData, gridParent, isActiveGrid } = gridSchema;
	const isOnlyItem = gridSchemaStore.length === 1;
	return (
		<Typography
			variant='subtitle1'
			onClick={!isActiveGrid ? activateGrid : undefined}
			sx={{
				userSelect: 'none',
				cursor: !isActiveGrid ? 'pointer' : 'default',
				fontWeight: 700,
				color:
					isActiveGrid && !isOnlyItem
						? 'primary.main'
						: 'text.primary',
				px: 0.5,
				py: 0.2,
				borderRadius: 1,
				transition: 'all 0.15s ease',
				'&:hover': {
					textDecoration: isActiveGrid ? 'none' : 'underline',
				},
			}}
		>
			{capitalizeFirst(gridName)}
		</Typography>
	);
}

