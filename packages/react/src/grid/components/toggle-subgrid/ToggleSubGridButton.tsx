import { useToggleSubGrid } from '../../hooks';
import {
	type GridId,
	type GridCellLocation,
	type GridDataReadonly,
} from '@jsoc/core/grid';

export type ToggleSubGridButtonProps = {
	/**
	 * data of the sub grid, is actually the `ColumnValue` of the `GridRow[rowId][ColumnKey]`
	 * using which the rows and columns will be generated.
	 */
	subGridData: GridDataReadonly;
	/**
	 * `GridId` of the grid that will render this button
	 */
	parentGridId: GridId;
	/**
	 * Location of the `GridCell` that will render this button
	 */
	parentGridCellLocation: GridCellLocation;
};
export function ToggleSubGridButton({
	subGridData,
	parentGridId,
	parentGridCellLocation,
}: ToggleSubGridButtonProps) {
	const { isPresentInStore, toggleText, toggleSubGrid } = useToggleSubGrid(
		subGridData,
		parentGridId,
		parentGridCellLocation
	);

	const Icon = getIcon(isPresentInStore ? 'closed' : 'open', 0);

	return (
		<IconButton
			title={toggleText}
			size='small'
			onClick={toggleSubGrid}
			sx={{
				'&:focus': {
					outline: 'none',
				},
			}}
		>
			<Icon fontSize='small' />
		</IconButton>
	);
}

//#region Icons
import {
	OpenInFull,
	CloseFullscreen,
	ArrowBackIosNew,
	ArrowForwardIos,
	OpenInNew,
	OpenInNewOff,
	SubdirectoryArrowLeft,
	SubdirectoryArrowRight,
	GridOn,
	GridOff,
} from '@mui/icons-material';
import { IconButton, type SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type IconType = 'open' | 'closed';
type SampleIcons = Record<IconType, OverridableComponent<SvgIconTypeMap>[]>;

const TOGGLE_SAMPLE_ICONS: SampleIcons = {
	open: [
		GridOn,
		OpenInNew,
		OpenInFull,
		ArrowForwardIos,
		SubdirectoryArrowRight,
	],
	closed: [
		GridOff,
		OpenInNewOff,
		CloseFullscreen,
		ArrowBackIosNew,
		SubdirectoryArrowLeft,
	],
};

function getIcon(iconType: IconType, index: number) {
	return TOGGLE_SAMPLE_ICONS[iconType][index];
}

//#endregion
