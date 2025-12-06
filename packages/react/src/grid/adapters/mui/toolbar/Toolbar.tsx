import { DefaultNavigator } from '../../../components';
import { InbuiltToolbarButtonsMui } from './components';
import { Toolbar } from '@mui/x-data-grid';

export function DefaultToolbarMui() {
	return (
		<Toolbar>
			<DefaultNavigator />
			<InbuiltToolbarButtonsMui />
		</Toolbar>
	);
}
