//#region imports
import { useHidePopperDom } from '../../hooks';
import { useToggleSubGrid } from '../../../../hooks';
import {
	type GridId,
	type GridCellLocation,
	type GridData,
} from '@jsoc/core/grid';
import { IconButton, SvgIconTypeMap, Tooltip } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
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
//#endregion

export type ToggleSubGridButtonMuiProps = {
	/**
	 * data of the sub grid, is actually the `ColumnValue` of the `GridRow[rowId][ColumnKey]`
	 * using which the rows and columns will be generated.
	 */
	subGridData: GridData;
	/**
	 * `GridId` of the grid that will render this button
	 */
	parentGridId: GridId;
	/**
	 * Location of the `GridCell` that will render this button
	 */
	parentGridCellLocation: GridCellLocation;
};

export function ToggleSubGridButtonMui({
	subGridData,
	parentGridId,
	parentGridCellLocation,
}: ToggleSubGridButtonMuiProps) {
	const { popperHide, popperRef } = useHidePopperDom();
	const { isPresentInStore, toggleText, toggleSubGrid } =
		useToggleSubGrid(
			subGridData,
			parentGridId,
			parentGridCellLocation
		);
	const Icon = getIcon(isPresentInStore ? 'closed' : 'open');

	return (
		<Tooltip
			title={toggleText}
			slotProps={{
				popper: { popperRef },
			}}
		>
			<IconButton
				size='small'
				onClick={() => {
					popperHide();
					toggleSubGrid();
				}}
				sx={{
					'&:focus': {
						outline: 'none',
					},
				}}
			>
				<Icon fontSize='small' />
			</IconButton>
		</Tooltip>
	);
}

type IconType = 'open' | 'closed';
type SampleIcons = Record<IconType, OverridableComponent<SvgIconTypeMap>[]>;
function getIcon(iconType: IconType) {
	const TOGGLE_SAMPLE_ICONS_MUI: SampleIcons = {
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

	const index = 0;
	return TOGGLE_SAMPLE_ICONS_MUI[iconType][index];
}
