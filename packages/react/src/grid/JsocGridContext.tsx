import { createContext, Dispatch, SetStateAction } from 'react';
import { GridSchemaStack } from '@jsoc/core/grid';

interface JsocGridContext {
	gridSchemaStack: GridSchemaStack;
	setGridSchemaStack: Dispatch<SetStateAction<GridSchemaStack>>;
}

const JsocGridContextFake: JsocGridContext = {
	gridSchemaStack: [],
	setGridSchemaStack: () => {},
};

export const JsocGridContext = createContext(JsocGridContextFake);
