import { FC } from 'react';
import {
	type View,
	type Ui,
	VIEW_REGISTRY,
	ADAPTER_REGISTRY,
	ViewAdapterProps,
} from '../registry';
import { JsocInvalidViewError, JsocInvalidAdapterError } from '@jsoc/core';
import { JsocErrorBoundary } from './JsocErrorBoundary';
import { JsocErrorFallback } from './JsocErrorFallback';

export type JsocData = unknown;

export type JsocProps<V extends View, U extends Ui<V>> = {
	data: JsocData;
	view: V;
	ui: U;
	viewAdapterProps?: ViewAdapterProps<V, U>;
};

export type JsocViewProps<V extends View, U extends Ui<V>> = {
	data: JsocData;
	viewAdapter: FC<ViewAdapterProps<V, U> | {}>;
	viewAdapterProps?: ViewAdapterProps<V, U>;
};

// ROOT COMPONENT
export function Jsoc<V extends View, U extends Ui<V>>({
	data,
	view,
	ui,
	viewAdapterProps,
}: JsocProps<V, U>) {
	const error = validateJsocProps(view, ui);
	if (error) {
		return <JsocErrorFallback error={error} />;
	}

	const JsocView = VIEW_REGISTRY[view] as FC<JsocViewProps<V, U>>;
	const JsocViewAdapter = ADAPTER_REGISTRY[view][ui] as FC<
		ViewAdapterProps<V, U> | {}
	>;
	return (
		<JsocErrorBoundary>
			<JsocView
				data={data}
				viewAdapter={JsocViewAdapter}
				viewAdapterProps={viewAdapterProps}
			/>
		</JsocErrorBoundary>
	);
}

function validateJsocProps<V extends View>(view: V, ui: Ui<V>) {
	if (!(view in VIEW_REGISTRY)) {
		return new JsocInvalidViewError(view, Object.keys(VIEW_REGISTRY));
	}

	if (!(ui in ADAPTER_REGISTRY[view])) {
		return new JsocInvalidAdapterError(
			view,
			ui,
			Object.keys(ADAPTER_REGISTRY[view])
		);
	}
}

// test props
// Jsoc({ data: '', view: 'grid', ui: 'mui', adapterProps: { slots: {} } });
