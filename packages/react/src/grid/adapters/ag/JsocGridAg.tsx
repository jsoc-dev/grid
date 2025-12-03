import { JsocGridContext } from '../../wrapper/JsocGrid';
import { COLUMN_FACTORY_AG } from '../ag/column-factory';
import { deleteKeys, SubsetKeysOf } from '@jsoc/core';
import { useContext } from 'react';
import {
	type CustomColumnFactory,
	generateColumns,
	getActiveGridSchema,
} from '@jsoc/core/grid';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
	type ColDef,
	ModuleRegistry,
	AllCommunityModule,
	type GetRowIdFunc,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Adapter component for AG-Grid
 */
export function JsocGridAg(props: JsocGridAgProps) {
	const { gridSchemaStore, showDefaultNavigator } =
		useContext(JsocGridContext);
	const gridSchema = getActiveGridSchema(gridSchemaStore);
	const { gridPlainRows, gridPrimaryColumnKey } = gridSchema;
	const getRowId: GetRowIdFunc = ({ data }) => data[gridPrimaryColumnKey];
	const columnDefs = generateColumns(
		gridSchema,
		COLUMN_FACTORY_AG,
		props.customColumnFactory
	);
	const userSuppliedProps = deleteKeys(props, [
		...JSOC_GRID_AG_CUSTOM_PROP_NAMES,
	]);

	return (
		<AgGridReact
			{...userSuppliedProps}
			rowData={gridPlainRows}
			getRowId={getRowId}
			columnDefs={columnDefs}
		/>
	);
}

/**
 * Props that customise or disable the `JsocGrid` features
 * These props are not part of `AgGridReactProps` as they don't exist in `AgGridReact`
 */
export type JsocGridAgCustomProps = {
	customColumnFactory?: CustomColumnFactory<ColDef>;
};
export type JsocGridAgCustomPropNames = keyof JsocGridAgCustomProps;
export const JSOC_GRID_AG_CUSTOM_PROP_NAMES: Array<JsocGridAgCustomPropNames> =
	['customColumnFactory'];

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
