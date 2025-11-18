import { createContext } from 'react';
import { GridKey, GridData } from '@jsoc/core';

//types
export type GridNavigatorStackItem = {
	gridKey: GridKey;
	gridData: GridData;
};
export type GridNavigatorStack = GridNavigatorStackItem[];

interface JsocGridContext {
	gridNavigatorStack: GridNavigatorStack,
	setGridNavigatorStack: React.Dispatch<
		React.SetStateAction<GridNavigatorStack>
	>;
}

const JsocGridContextFake: JsocGridContext = {
	gridNavigatorStack: [],
	setGridNavigatorStack: () => {},
};

export const JsocGridContext = createContext(JsocGridContextFake);
