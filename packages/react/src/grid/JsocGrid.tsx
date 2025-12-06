import {
	type GridUiAdapterName,
	type GridUiAdapterComponent,
	type GridUiAdapterComponentProps,
	GRID_UI_ADAPTERS,
} from './adapters';
import { PlainObject } from '@jsoc/core/utils';
import {
	type GridDataReadonly,
	type GridSchemaStore,
	initGridSchemaStore,
	FALLBACK_ROOT_GRID_ID,
} from '@jsoc/core/grid';
import {
	type FC,
	type ReactNode,
	type ReactElement,
	type Dispatch,
	type SetStateAction,
	useState,
	useEffect,
	createContext,
	Activity,
	Fragment,
} from 'react';

export type JsocGridContextValue = {
	gridSchemaStore: GridSchemaStore;
	setGridSchemaStore: Dispatch<SetStateAction<GridSchemaStore>>;
};

export type JsocGridCustomWrapper<U extends GridUiAdapterName> =
	React.ComponentType<{
		children: ReactElement<GridUiAdapterComponent<U>>;
	}>;

export const JsocGridContext = createContext<JsocGridContextValue>({
	gridSchemaStore: [],
	setGridSchemaStore: () => undefined,
});

export type JsocGridProps<U extends GridUiAdapterName> = {
	data: GridDataReadonly;
	children?: ReactNode;
	ui: U;
	uiProps?: GridUiAdapterComponentProps<U>;
	/**
	 * Custom wrapper component to wrap around each grid instance.
	 * @default React.Fragment
	 */
	CustomWrapper?: JsocGridCustomWrapper<U>;
};

/**
 * JSOC Grid
 *
 * Renders a dynamic grid from JSON data without requiring
 * explicit row or column configuration.
 *
 * @typeParam U - UI adapter name (react / angular / vue)
 * 
 * TODO: 1. Make JsocGrid minimal (no dependency other than adapters i.e. DataGrid, AgGridReact)
 - To achieve this, remove the default navigator, provide a simple previous button in bottom of the grids
 - use in house icons, remove dependency on mui so that JsocGrid is totally headless
 */
export function JsocGrid<U extends GridUiAdapterName>({
	data,
	ui,
	uiProps,
	CustomWrapper = Fragment,
}: JsocGridProps<U>) {
	const rootGridId = uiProps?.custom?.gridId || FALLBACK_ROOT_GRID_ID;
	const [gridSchemaStore, setGridSchemaStore] = useState(
		initGridSchemaStore(rootGridId, data),
	);

	useEffect(() => {
		setGridSchemaStore(initGridSchemaStore(rootGridId, data));
	}, [rootGridId, data]);

	const UiAdapter = GRID_UI_ADAPTERS[ui] as FC<
		GridUiAdapterComponentProps<U> | PlainObject
	>;

	return (
		<JsocGridContext.Provider
			value={{
				gridSchemaStore,
				setGridSchemaStore,
			}}
		>
			{gridSchemaStore.map((gridSchema) => (
				<Activity
					key={gridSchema.gridId}
					mode={gridSchema.isActiveGrid ? 'visible' : 'hidden'}
				>
					<CustomWrapper>
						<UiAdapter
							{...uiProps}
							{...{
								custom: {
									...uiProps?.custom,
									gridId: gridSchema.gridId, // need to supplied always and use the id of gridSchema, not the consumer provided which is only for root grid
								},
							}}
						/>
					</CustomWrapper>
				</Activity>
			))}
		</JsocGridContext.Provider>
	);
}
