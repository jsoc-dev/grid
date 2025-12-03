import { DefaultNavigatorMui } from '../navigator/Navigator';
import { InbuiltToolbarButtonsMui } from './components';
import { Toolbar } from '@mui/x-data-grid';

export function DefaultToolbarMui() {
	return (
		<Toolbar>
			<DefaultNavigatorMui />
			<InbuiltToolbarButtonsMui />
		</Toolbar>
	);
}
