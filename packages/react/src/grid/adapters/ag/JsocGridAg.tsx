import { JsocGridContext } from '../../JsocGrid';
import { COLUMN_FACTORY_AG } from './column-factory/';
import { JsocGridError } from '@jsoc/core/errors';
import { SubsetKeysOf } from '@jsoc/core/utils';
import {
	type GridId,
	type CustomColumnFactory,
	generateColumns,
	searchGridSchema,
} from '@jsoc/core/grid';
import { useContext, useMemo } from 'react';
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
	/**
	 * Name for the root grid. This is used by the default navigator to indicate whether
	 * root grid is active or not.
	 * - Note: This prop is managed by `JsocGrid` and always has a value even if you don't
	 * 	provide any value.
	 */
	gridId?: GridId;
	/**
	 * Object containing 0 or more custom `ColumnDefinitionProvider`s to override the
	 * corresponding default `ColumnDefinitionProvider`s for the `ColumnDataType`.
	 */
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
	native?: Omit<AgGridReactProps, JsocGridAgInjectedPropNames>;
	custom?: JsocGridAgCustomProps;
};

//#endregion

/**
 * Adapter component for AG-Grid
 */
export function JsocGridAg({ native = {}, custom = {} }: JsocGridAgProps) {
	if (!custom.gridId) {
		throw new JsocGridError(
			"An internal error occured. JsocGrid didn't provide the gridId to the adapter."
		);
	}

	const { gridSchemaStore } =
		useContext(JsocGridContext);
	const { gridSchema } = searchGridSchema(gridSchemaStore, custom.gridId);
	const { gridRows, gridIdColumnKey } = gridSchema;
	const getRowId: GetRowIdFunc = ({ data }) => data[gridIdColumnKey];

	const columnDefs = useMemo(
		() =>
			generateColumns(
				gridSchema,
				COLUMN_FACTORY_AG,
				custom.columnFactory
			),
		[gridSchema, custom.columnFactory]
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