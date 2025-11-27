import { useSubGridToggle } from '@/grid';
import { type GridSchema } from '@jsoc/core/grid';
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
};

export function SubGridToggleButtonMui({
	subGridSchema,
}: SubGridToggleButtonMuiProps) {
	const { text, isPresentInStore, presentIndex, toggle } =
		useSubGridToggle(subGridSchema);

	const iconIndex = 0;
	const Icon =
		TOGGLE_SAMPLE_ICONS_MUI[isPresentInStore ? 'close' : 'open'][iconIndex];

	return (
		<>
			<Tooltip title={text}>
				<IconButton
					size='small'
					onClick={toggle}
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
