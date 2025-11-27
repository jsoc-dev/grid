import {
	COLUMN_FACTORY_AG,
	JsocGridContext,
	JsocGridContextValue,
} from '@/grid';
import { deleteKeys, PlainObject, SubsetKeysOf } from '@jsoc/core';
import { useContext } from 'react';
import {
	type CustomColumnFactory,
	generateColumns,
	generateRows,
	getActiveGridSchema,
} from '@jsoc/core/grid';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
	type ColDef,
	ModuleRegistry,
	AllCommunityModule,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

//#region props

/**
 * Props that customise or disable the `JsocGrid` features
 * These props are not part of `AgGridReactProps` as they don't exist in `AgGridReact`
 */
export type JsocGridAgCustomProps = {
	customColumnFactory?: CustomColumnFactory<ColDef>;
};
export type JsocGridAgCustomPropNames = keyof JsocGridAgCustomProps;

/**
 * Props that are dynamically injected by the adapter `JsocGridAg` into the `AgGridReact`
 * These props are subset of `AgGridReactProps` but not required to be supplied by the consumer. If provided, will be ignored.
 */
export type JsocGridAgInjectedProps = Pick<
	AgGridReactProps,
	JsocGridAgInjectedPropNames
>;
export type JsocGridAgInjectedPropNames = SubsetKeysOf<
	AgGridReactProps,
	'rowData' | 'columnDefs'
>;

/**
 * The public adapter props that will be supplied by the consumer.
 * Intersection of non-injected `AgGridReactProps` and `JsocGridAgCustomProps`
 */
export type JsocGridAgProps = Omit<
	AgGridReactProps,
	JsocGridAgInjectedPropNames
> &
	JsocGridAgCustomProps;

//#endregion

export function JsocGridAg(props: JsocGridAgProps) {
	const jsocGridContextValue = useContext(JsocGridContext);
	const finalProps = buildFinalProps(props, jsocGridContextValue);

	return (
		<>
			<AgGridReact {...finalProps} />
		</>
	);
}

export const JSOC_GRID_AG_CUSTOM_PROP_NAMES: Array<JsocGridAgCustomPropNames> =
	['customColumnFactory'];

/**
 * Builds final props that are passed to the `AgGridReact` by combining:
 *   - filtered consumer-supplied `AgGridReactProps` (removes custom props)
 *   - dynamically generated `JsocGridAgInjectedProps`
 */
function buildFinalProps(
	props: JsocGridAgProps,
	jsocGridContextValue: JsocGridContextValue
): AgGridReactProps {
	const { gridSchemaStore, noDefaultNavigator } = jsocGridContextValue;
	const gridSchema = getActiveGridSchema(gridSchemaStore);
	const {gridPlainRows, gridPrimaryColumnKey} = gridSchema;


	const getRowId = ({ data }: { data: PlainObject }) =>
		String(data[gridPrimaryColumnKey]);

	const columnDefs = generateColumns(
		gridPlainRows,
		gridSchema,
		gridPrimaryColumnKey,
		COLUMN_FACTORY_AG,
		props.customColumnFactory
	);

	return {
		...filterSuppliedProps(props),
		rowData: gridPlainRows,
		getRowId,
		columnDefs,
	};
}

function filterSuppliedProps(props: JsocGridAgProps) {
	return deleteKeys(props, [...JSOC_GRID_AG_CUSTOM_PROP_NAMES]);
}