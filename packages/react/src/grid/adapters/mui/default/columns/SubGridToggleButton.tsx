import { useSubGridToggle } from '../../../../hooks/useSubGridToggle';
import { type GridSchema, type SearchGridSchemaResult } from '@jsoc/core/grid';
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
import { useHidePopperDom } from '../../hooks';

type SampleIcons = Record<
	'open' | 'close',
	OverridableComponent<SvgIconTypeMap>[]
>;

const TOGGLE_SAMPLE_ICONS_MUI: SampleIcons = {
	open: [
		GridOn,
		OpenInNew,
		OpenInFull,
		ArrowForwardIos,
		SubdirectoryArrowRight,
	],
	close: [
		GridOff,
		OpenInNewOff,
		CloseFullscreen,
		ArrowBackIosNew,
		SubdirectoryArrowLeft,
	],
};

type SubGridToggleButtonMuiProps = {
	subGridSchema: GridSchema;
	searchResult: SearchGridSchemaResult;
};

export function SubGridToggleButtonMui({
	subGridSchema,
	searchResult,
}: SubGridToggleButtonMuiProps) {
	const { isPresentInStore } = searchResult;
	const { text, toggle } = useSubGridToggle(subGridSchema, searchResult);

	const iconIndex = 0;
	const Icon =
		TOGGLE_SAMPLE_ICONS_MUI[isPresentInStore ? 'close' : 'open'][iconIndex];

	const { popperHide, popperRef } = useHidePopperDom();
	return (
		<>
			<Tooltip
				title={text}
				slotProps={{
					popper: { popperRef },
				}}
			>
				<IconButton
					size='small'
					onClick={() => {
						popperHide();
						toggle();
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
		</>
	);
}
