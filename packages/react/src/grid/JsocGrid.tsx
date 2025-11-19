import { JsocGridContext } from './JsocGridContext';
import { useGridNavigator } from './hooks/useGridNavigator';
import { GridData, GridKey } from '@jsoc/core/grid';
import { JsocGridMui } from './adapters/mui/JsocGridMui';
import { JsocGridAg } from './adapters/ag/JsocGridAg';
import { ExtractProps } from '../utils/types';
import { PlainObject, SpreadableObject } from '@jsoc/core';
import { FC } from 'react';

// _____________________IMPORTS ENDED__________________

export const GRID_UI = {
	mui: JsocGridMui,
	ag: JsocGridAg,
} as const;

export type GridUi = Extract<keyof typeof GRID_UI, string>;

export type GridUiAdapter<U extends GridUi> = (typeof GRID_UI)[U];

export type GridUiAdapterProps<U extends GridUi> = SpreadableObject<
	ExtractProps<GridUiAdapter<U>>
>;

export type JsocGridProps<U extends GridUi> = {
	title: GridKey,
	data: GridData;
	ui: U;
	uiAdapterProps?: GridUiAdapterProps<U>;
};

export function JsocGrid<U extends GridUi>({
	data,
	title,
	ui,
	uiAdapterProps,
}: JsocGridProps<U>) {
	const [gridSchemaStack, setGridSchemaStack] = useGridNavigator(title, data);

	const UiAdapter = GRID_UI[ui] as FC<
		GridUiAdapterProps<U> | PlainObject
	>;

	return (
		<JsocGridContext.Provider
			value={{ gridSchemaStack, setGridSchemaStack }}
		>
			<UiAdapter {...uiAdapterProps} />
		</JsocGridContext.Provider>
	);
}
