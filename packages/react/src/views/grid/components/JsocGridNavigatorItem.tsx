import { isSymbol, DEFAULT_ROOT_GRID_KEY, trimSymbol, GridKey } from '@jsoc/core';
import { JsocGridContext } from '../JsocGridContext';
import { useContext } from 'react';

type JsocGridNavigatorNodeProps = {
	index: number;
};
export default function JsocGridNavigatorNode({
	index,
}: JsocGridNavigatorNodeProps) {
	const { gridNavigatorStack, setGridNavigatorStack } =
		useContext(JsocGridContext);
	const item = gridNavigatorStack[index];
	const lastItemIndex = gridNavigatorStack.length - 1;
	const isActive = index === lastItemIndex;
	const isClickable = !isActive;

	return (
		<>
			<span
				style={{
					fontWeight: isActive ? 700 : 500,
					textDecorationLine: isActive ? 'none' : 'underline',
					cursor: isClickable ? 'pointer' : 'auto',
				}}
				onClick={onClick}
			>
				{getText(item.gridKey)}
			</span>
			{(!isActive) && '>'}
		</>
	);

	function onClick() {
		if (isActive) {
		} else {
			const sliced = gridNavigatorStack.slice(0, index+1);
			setGridNavigatorStack(sliced);
		}
	}
}

function getText(key: GridKey): string {
	if (isSymbol(key)) {
		const trimmed = trimSymbol(key);
		if (trimmed === DEFAULT_ROOT_GRID_KEY) {
			return trimmed;
		} else {
			// this should never happen unless data was object with symbols keys
			return trimmed;
		}
	} else {
		return key;
	}
}
