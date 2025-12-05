
import { GridInput } from './components/GridInput';
import { GridUiChoice } from './components/GridUiChoice';
import { GridUiOutput } from './components/GridUiOutput';
import products from './json/products.json'
import { JsocGridDemoContext } from './JsocGridDemoContext';
import type { GridData } from '@jsoc/core/grid';
import { type GridUiAdapterName } from '@jsoc/react/grid';
import { useState } from 'react';

export function JsocGridDemo() {

	const [gridName, setGridName] = useState('products')
	const [gridData, setGridData] = useState<GridData>(products);
	const [gridDataError, setGridDataError] = useState('');
	const [gridUi, setGridUi] = useState<GridUiAdapterName | ''>('');

	const contextValue: JsocGridDemoContext= {
		gridName, 
		setGridName,
		gridData,
		setGridData,
		gridDataError,
		setGridDataError,
		gridUi,
		setGridUi,
	};

	return (
		<JsocGridDemoContext.Provider value={contextValue}>
			<GridInput/>
			<GridUiChoice/>
			{gridUi && !gridDataError && <GridUiOutput/>}
		</JsocGridDemoContext.Provider >
	);
}
