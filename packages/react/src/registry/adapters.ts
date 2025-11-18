import { FC } from 'react';
import { SpreadableObject } from '@jsoc/core';
import { View } from './views';
import { JsocGridMui } from '../views/grid/ui/mui/JsocGridMui';
import { JsocGridAg } from '../views/grid/ui/ag/JsocGridAg';
import { JsocFormA } from '../views/form/ui/a/JsocFormA';
import { JsocFormB } from '../views/form/ui/b/JsocFormB';

export type PropsOf<C> = C extends FC<infer P> ? P : never;

// AdapterComponents, AdapterRegistry types defined below are just for basic typesafety
// which will assist while adding more values in ADAPTER_REGISTRY
type AdapterComponents = {
	[U in string]: FC<any>; // WARNING: Ui keys and function props are being not type checked here
};

type AdapterRegistry = {
	[V in View]: AdapterComponents; // but View keys are being type checked
};

export const ADAPTER_REGISTRY = {
	grid: {
		mui: JsocGridMui,
		ag: JsocGridAg,
	},
	form: {
		a: JsocFormA,
		b: JsocFormB,
	},
} as const satisfies AdapterRegistry;


// Ui, Adapter types are infered types from ADAPTER_REGISTRY, for type safety of view and ui props in Jsoc
export type Ui<V extends View> = Extract<
	keyof (typeof ADAPTER_REGISTRY)[V],
	string
>;

export type ViewAdapter<
	V extends View,
	U extends Ui<V>
> = (typeof ADAPTER_REGISTRY)[V][U];


export type ViewAdapterProps<V extends View, U extends Ui<V>> = SpreadableObject<
	PropsOf<(typeof ADAPTER_REGISTRY)[V][U]>
>;
