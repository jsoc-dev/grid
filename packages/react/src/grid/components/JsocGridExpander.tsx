import { GridData, GridKey, push } from '@jsoc/core/grid';
import { JsocGridContext } from '../JsocGridContext';
import { useContext } from 'react';

type JsocGridExpanderProps = {
	gridKey: GridKey;
	gridData: GridData;
};
export function JsocGridExpander({ gridKey, gridData }: JsocGridExpanderProps) {
	const { gridSchemaStack, setGridSchemaStack } = useContext(JsocGridContext);

	return <button onClick={onClick}>View</button>;

	function onClick() {
		const newGridSchema = {
			gridKey,
			gridData,
			isActiveGrid: true,
		};

		setGridSchemaStack(push(gridSchemaStack, newGridSchema))
	}
}
