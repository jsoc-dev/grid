import {
	GRID_UI_ADAPTERS,
	GridUiAdapterComponentProps,
	GridUiAdapterName,
} from '@/grid';
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
} from 'react';

export type JsocGridProps<U extends GridUiAdapterName> = {
	name: GridName;
	data: GridData;
	children?: ReactNode;
	uiAdapterName: U;
	uiAdapterProps?: GridUiAdapterComponentProps<U>;
	/**
	 * If `true`, the default navigator won't be rendered
	 */
	noDefaultNavigator?: boolean;
};

export type JsocGridContextValue = {
	gridSchemaStore: GridSchemaStore;
	setGridSchemaStore: Dispatch<SetStateAction<GridSchemaStore>>;
	noDefaultNavigator: boolean | undefined;
};

export const JsocGridContext = createContext<JsocGridContextValue>({
	gridSchemaStore: [],
	setGridSchemaStore: () => {},
	noDefaultNavigator: undefined,
});

export function JsocGrid<U extends GridUiAdapterName>({
	name,
	data,
	children,
	uiAdapterName,
	uiAdapterProps,
	noDefaultNavigator,
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
			value={{ gridSchemaStore, setGridSchemaStore, noDefaultNavigator }}
		>
			{children}
			<UiAdapter {...uiAdapterProps} />
		</JsocGridContext.Provider>
	);
}
