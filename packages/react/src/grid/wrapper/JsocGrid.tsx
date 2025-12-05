import {
	GRID_UI_ADAPTERS,
	type GridUiAdapterComponentProps,
	type GridUiAdapterName,
} from './adapter-registry';
import { PlainObject } from '@jsoc/core';
import { initGridSchemaStore, type GridData, type GridSchemaStore } from '@jsoc/core/grid';
import {
	type FC,
	type JSX,
	type ReactNode,
	type Dispatch,
	type SetStateAction,
	useState,
	useEffect,
	createContext,
	Activity,
} from 'react';

export type JsocGridProps<U extends GridUiAdapterName> = {
	data: GridData;
	children?: ReactNode;
	uiAdapterName: U;
	uiAdapterProps: GridUiAdapterComponentProps<U>;
	/**
	 * Allows consumer to wrap or transform the UiAdapter component by providing a render function
	 */
	uiAdapterRenderer?: (adapter: JSX.Element) => JSX.Element;
	/**
	 * If `true`, the default navigator won't be rendered
	 */
	showDefaultNavigator?: boolean;
};

export type JsocGridContextValue = {
	gridSchemaStore: GridSchemaStore;
	setGridSchemaStore: Dispatch<SetStateAction<GridSchemaStore>>;
	showDefaultNavigator: boolean;
};

export const JsocGridContext = createContext<JsocGridContextValue>({
	gridSchemaStore: [],
	setGridSchemaStore: () => {},
	showDefaultNavigator: true,
});

export function JsocGrid<U extends GridUiAdapterName>({
	data,
	uiAdapterName,
	uiAdapterProps,
	uiAdapterRenderer = (adapter) => adapter, // default renderer just returns the adapter as it is
	showDefaultNavigator = true,
}: JsocGridProps<U>) {
	const { gridId } = uiAdapterProps.custom;
	const [gridSchemaStore, setGridSchemaStore] = useState(initGridSchemaStore(gridId, data));

	useEffect(() => {
		setGridSchemaStore(initGridSchemaStore(gridId, data));
	}, [gridId, data]);

	const UiAdapter = GRID_UI_ADAPTERS[uiAdapterName] as FC<
		GridUiAdapterComponentProps<U> | PlainObject
	>;

	return (
		<JsocGridContext.Provider
			value={{
				gridSchemaStore,
				setGridSchemaStore,
				showDefaultNavigator,
			}}
		>
			{gridSchemaStore.map((gridSchema) => (
				<Activity
					key={gridSchema.gridId}
					mode={gridSchema.isActiveGrid ? 'visible' : 'hidden'}
				>
					{uiAdapterRenderer(
						<UiAdapter
							{...uiAdapterProps}
							{...{
								custom: {
									...uiAdapterProps.custom,
									gridId: gridSchema.gridId,
								},
							}}
						/>
					)}
				</Activity>
			))}
		</JsocGridContext.Provider>
	);
}
