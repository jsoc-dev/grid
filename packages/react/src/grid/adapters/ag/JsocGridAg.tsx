import { JsocGridContext } from '../../wrapper/JsocGrid';
import { COLUMN_FACTORY_AG } from '../ag/column-factory';
import { deleteKeys, ensureString, SubsetKeysOf } from '@jsoc/core';
import { useContext } from 'react';
import {
	type GridId,
	type CustomColumnFactory,
	generateColumns,
	getActiveGridSchema,
	searchGridSchema,
} from '@jsoc/core/grid';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
	type ColDef,
	ModuleRegistry,
	AllCommunityModule,
	type GetRowIdFunc,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

//#region props
/**
 * Props that customise the `JsocGrid` features
 * These props are not part of `AgGridReactProps` as they don't exist in `AgGridReact`
 */
export type JsocGridAgCustomProps = {
	gridId: GridId;
	columnFactory?: CustomColumnFactory<ColDef>;
};

/**
 * Props that are dynamically injected by the adapter `JsocGridAg` into the `AgGridReact`
 * These props are subset of `AgGridReactProps` but not required to be supplied by the consumer. If provided, will be ignored.
 */
export type JsocGridAgInjectedPropNames = SubsetKeysOf<
	AgGridReactProps,
	'rowData' | 'columnDefs'
>;
export type JsocGridAgInjectedProps = Pick<
	AgGridReactProps,
	JsocGridAgInjectedPropNames
>;

/**
 * The public adapter props that will be supplied by the consumer.
 */
export type JsocGridAgProps = {
	native: Omit<AgGridReactProps, JsocGridAgInjectedPropNames>;
	custom: JsocGridAgCustomProps;
};

//#endregion

/**
 * Adapter component for AG-Grid
 */
export function JsocGridAg({ native = {}, custom }: JsocGridAgProps) {
	const { gridSchemaStore, showDefaultNavigator } =
		useContext(JsocGridContext);
	const { gridSchema } = searchGridSchema(gridSchemaStore, custom.gridId);
	const { gridRows, gridIdColumnKey } = gridSchema;
	const getRowId: GetRowIdFunc = ({ data }) => data[gridIdColumnKey];
	const columnDefs = generateColumns(
		gridSchemaStore,
		gridSchema,
		COLUMN_FACTORY_AG,
		custom.columnFactory
	);

	return (
		<AgGridReact
			{...native}
			rowData={gridRows}
			getRowId={getRowId}
			columnDefs={columnDefs}
		/>
	);
}
