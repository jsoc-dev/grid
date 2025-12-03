import { PlainObject } from '@jsoc/core';
import {
	init,
	type GridData,
	type GridName,
	type GridSchemaStore,
} from '@jsoc/core/grid';
import {
	createContext,
	Dispatch,
	SetStateAction,
	FC,
	ReactNode,
	useEffect,
	useState,
	type JSX,
	Activity,
} from 'react';
import {
	GRID_UI_ADAPTERS,
	type GridUiAdapterComponentProps,
	type GridUiAdapterName,
} from './adapter-registry';

export type JsocGridProps<U extends GridUiAdapterName> = {
	name: GridName;
	data: GridData;
	children?: ReactNode;
	uiAdapterName: U;
	uiAdapterProps?: GridUiAdapterComponentProps<U>;
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
	name,
	data,
	uiAdapterName,
	uiAdapterProps,
	uiAdapterRenderer = (adapter) => adapter,
	showDefaultNavigator = true,
}: JsocGridProps<U>) {
	const [gridSchemaStore, setGridSchemaStore] = useState(init(name, data));

	useEffect(() => {
		setGridSchemaStore(init(name, data));
	}, [name, data]);

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
			{uiAdapterRenderer(<UiAdapter {...uiAdapterProps} />)}
		</JsocGridContext.Provider>
	);
}
