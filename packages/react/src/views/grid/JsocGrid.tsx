import { useMemo, useState } from 'react';
import { JsocData, JsocViewProps } from '../../jsoc/Jsoc';
import {
	GridNavigatorStack,
	GridNavigatorStackItem,
	JsocGridContext,
} from './JsocGridContext';
import { Ui, View } from '../../registry';
import { getRootGrid } from '@jsoc/core';

// _____________________IMPORTS ENDED__________________

export function JsocGrid<V extends View, U extends Ui<V>>({
	data,
	viewAdapter: ViewAdapter,
	viewAdapterProps,
}: JsocViewProps<V, U>) {
	const rootGrid = useMemo(() => {
		return getRootGrid(data);
	}, [data]);
	const [gridNavigatorStack, setGridNavigatorStack] = useState(
		[rootGrid]
	);

	return (
		<JsocGridContext.Provider
			value={{
				gridNavigatorStack,
				setGridNavigatorStack,
			}}
		>
			<ViewAdapter {...viewAdapterProps} />
		</JsocGridContext.Provider>
	);
}
