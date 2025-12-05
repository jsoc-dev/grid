import { JsocGridContext } from '../../wrapper';
import { COLUMN_FACTORY_MUI, DefaultToolbarMui } from './default';
import { SubsetKeysOf, deleteKeys, ensureString } from '@jsoc/core';
import {
	generateColumns,
	CustomColumnFactory,
	GridId,
	searchGridSchema,
} from '@jsoc/core/grid';
import { createContext, RefObject, useContext, useMemo } from 'react';
import {
	DataGrid,
	DataGridProps,
	GridColDef,
	useGridApiRef,
	type GridRowIdGetter,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

//#region props
/**
 * Props that customise the `JsocGrid` features
 * These props are not part of DataGridProps as they don't exist in MUI DataGrid
 */
export type JsocGridMuiCustomProps = {
	gridId: GridId;
	columnFactory?: CustomColumnFactory<GridColDef>;
};

/**
 * Props that are dynamically injected by the adapter `JsocGridMui` into the `DataGrid`
 * These props are subset of `DataGridProps` but not required to be supplied by the consumer.
 * If provided, will be overridden by the dynamically injected values.
 */
export type JsocGridMuiInjectedPropNames = SubsetKeysOf<
	DataGridProps,
	'apiRef' | 'rows' | 'columns' | 'getRowId'
>;
export type JsocGridMuiInjectedProps = Pick<
	DataGridProps,
	JsocGridMuiInjectedPropNames
>;

/**
 * The public adapter component props that will be supplied by the consumer.
 */
export type JsocGridMuiProps = {
	native: Omit<DataGridProps, JsocGridMuiInjectedPropNames>;
	custom: JsocGridMuiCustomProps;
};
//#endregion

/**
 * Adapter component for MUI DataGrid
 */
export function JsocGridMui({ native = {}, custom }: JsocGridMuiProps) {
	const { gridSchemaStore, showDefaultNavigator } =
		useContext(JsocGridContext);
	const apiRef = useGridApiRef();
	const { gridSchema } = searchGridSchema(gridSchemaStore, custom.gridId);
	const { gridRows, gridIdColumnKey } = gridSchema;
	const getRowId: GridRowIdGetter = (row) => row[gridIdColumnKey];

	/**
	 * Memoising col defs to persist column states. Also suggested at official docs:
	 * https://mui.com/x/react-data-grid/column-definition/#:~:text=The%20columns%20prop%20should,function%20or%20memoize%20it.
	 */
	const columns = useMemo(
		() =>
			generateColumns(
				gridSchemaStore,
				gridSchema,
				COLUMN_FACTORY_MUI,
				custom.columnFactory
			),
		// re-generate only when current gridSchema or columnFactory prop changes
		[gridSchema, custom.columnFactory]
	);

	const showToolbar = showDefaultNavigator || native.showToolbar;
	const slots = {
		...native.slots,
		...(showDefaultNavigator && {
			toolbar: DefaultToolbarMui,
		}),
	};

	return (
		<JsocGridMuiContext.Provider value={{ apiRef }}>
			<DataGrid
				{...native}
				// key={gridId} // not needed now as the purpose is achieved using Activity mode hidden
				apiRef={apiRef}
				rows={gridRows}
				getRowId={getRowId}
				columns={columns}
				showToolbar={showToolbar}
				slots={slots}
			/>
		</JsocGridMuiContext.Provider>
	);
}

export type DataGridCommunityApiRef = RefObject<GridApiCommunity | null>;
export type JsocGridMuiContextValue = {
	apiRef: DataGridCommunityApiRef;
};
export const JsocGridMuiContext = createContext<JsocGridMuiContextValue>({
	apiRef: { current: null },
});
