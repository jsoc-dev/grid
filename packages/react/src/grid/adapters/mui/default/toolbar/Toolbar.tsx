import { DefaultNavigatorMui, InbuiltToolbarButtonsMui } from '@/grid';
import { Toolbar } from '@mui/x-data-grid';

export function DefaultToolbarMui() {
	return (
		<Toolbar>
			<DefaultNavigatorMui />
			<InbuiltToolbarButtonsMui />
		</Toolbar>
	);
}
