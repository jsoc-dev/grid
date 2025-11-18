import { generateColumnsSchema, GridData, GridKey } from '@jsoc/core';
import { JsocGridContext } from '../JsocGridContext';
import { useContext } from 'react';

type JsocGridExpanderProps = {
	gridKey: GridKey;
	gridData: GridData;
};
export function JsocGridExpander({ gridKey, gridData }: JsocGridExpanderProps) {
	const { gridNavigatorStack, setGridNavigatorStack } =
		useContext(JsocGridContext);

	return <button onClick={onClick}>View</button>;

	function onClick() {
		const newGridNavigatorStackItem = {
			gridKey: gridKey,
			gridData: gridData,
		};

		gridNavigatorStack.push(newGridNavigatorStackItem);
		setGridNavigatorStack([...gridNavigatorStack]);
	}
}
