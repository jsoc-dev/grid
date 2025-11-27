import {
	useGridSchemaStore,
	DefaultNavigatorItemMui,
	DefaultNavigatorTitleMui,
} from '@/grid';
import { Fragment } from 'react/jsx-runtime';
import { Stack } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

export function DefaultNavigatorMui() {
	const { gridSchemaStore } = useGridSchemaStore();

	return (
		<Stack
			direction='row'
			spacing={1}
			alignItems='center'
			flex={1}
			overflow='auto'
		>
			{gridSchemaStore.map((_, index, __) => {
				const isFirstItem = index === 0;

				return (
					<Fragment key={index}>
						{isFirstItem ? (
							<DefaultNavigatorTitleMui index={index} />
						) : (
							<>
								<NavigateNext fontSize='small' color='action' />
								<DefaultNavigatorItemMui index={index} />
							</>
						)}
					</Fragment>
				);
			})}
		</Stack>
	);
}
