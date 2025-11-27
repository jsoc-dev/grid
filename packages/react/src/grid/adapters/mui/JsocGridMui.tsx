import {
	JsocGridContext,
	JsocGridContextValue,
	COLUMN_FACTORY_MUI,
	DefaultToolbarMui,
	useRestoreGridParentFocus,
} from '@/grid';
import { SubsetKeysOf, deleteKeys } from '@jsoc/core';
import {
	generateColumns,
	generateRows,
	getActiveGridSchema,
	CustomColumnFactory,
	GridSchemaStore,
} from '@jsoc/core/grid';
import { createContext, RefObject, useContext } from 'react';
import {
	DataGrid,
	DataGridProps,
	GridColDef,
	GridValidRowModel,
	useGridApiRef,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

//#region props

/**
 * Props that customise or disable the `JsocGrid` features
 * These props are not part of DataGridProps as they don't exist in MUI DataGrid
 */
export type JsocGridMuiCustomProps = {
	customColumnFactory?: CustomColumnFactory<GridColDef>;
};
export type JsocGridMuiCustomPropNames = keyof JsocGridMuiCustomProps;

/**
 * Props that are dynamically injected by the adapter `JsocGridMui` into the `DataGrid`
 * These props are subset of `DataGridProps` but not required to be supplied by the consumer. If provided, will be ignored.
 */
export type JsocGridMuiInjectedProps = Pick<
	DataGridProps,
	JsocGridMuiInjectedPropNames
>;
export type JsocGridMuiInjectedPropNames = SubsetKeysOf<
	DataGridProps,
	'apiRef' | 'rows' | 'columns' | 'getRowId'
>;

/**
 * The public adapter props that will be supplied by the consumer.
 * Intersection of non-injected `DataGridProps` and `JsocGridMuiCustomProps`
 */
export type JsocGridMuiProps = Omit<
	DataGridProps,
	JsocGridMuiInjectedPropNames
> &
	JsocGridMuiCustomProps;

//#endregion

//#region component

export function JsocGridMui(props: JsocGridMuiProps) {
	const jsocGridContextValue = useContext(JsocGridContext);
	const apiRef = useGridApiRef();
	const key = getGridKey(jsocGridContextValue.gridSchemaStore);
	const finalProps = buildFinalProps(props, jsocGridContextValue);
	useRestoreGridParentFocus(apiRef);

	return (
		<JsocGridMuiContext.Provider value={{ apiRef }}>
			<DataGrid {...finalProps} key={key} apiRef={apiRef} />
		</JsocGridMuiContext.Provider>
	);
}

//#endregion

//#region constants

/**
 * List of names of all the Custom Props.
 * Using this list, custom props will be removed from supplied props before passing to `DataGrid`
 */
export const JSOC_GRID_MUI_CUSTOM_PROP_NAMES: Array<JsocGridMuiCustomPropNames> =
	['customColumnFactory'];

export type DataGridCommunityApiRef = RefObject<GridApiCommunity | null>;
export type JsocGridMuiContextValue = {
	apiRef: DataGridCommunityApiRef;
};

export const JsocGridMuiContext = createContext<JsocGridMuiContextValue>({
	apiRef: { current: null },
});
//#endregion

//#region helper functions

/**
 * Gets unique key for grid so that if there is any change in gridSchemaStore, 
 * recalculate the key based on the *active grid* in the GridSchemaStore.
 * So that DataGrid is remounted when the gridSchema changes.
 * 
 * This is necessary as MUI `DataGrid` internal states (like scroll position) 
 * does not reset across rerenders unless the component is fully remounted,
 * which causes 2 main issues:
 * 1. if user scrolled to row N in subgrid and closes it, then parent grid also scrolls to row N when rendered
 * 2. sometimes code breaks in firing focus lose event from the parent grid cell which no longer exists.
 *
 * - Issue 1 is resolved with the help of `useRestoreGridParentFocus` hook.
 * - Issue 2 is resolved as the component gets remounted. 
 */
function getGridKey(gridSchemaStore: GridSchemaStore) {
	const gridSchema = getActiveGridSchema(gridSchemaStore);
	const { gridId } = gridSchema;

	return gridId;
}

/**
 * Builds final props that are passed to the `DataGrid` by combining:
 *   - filtered consumer-supplied `DataGridProps` (removes custom props)
 *   - dynamically generated `JsocGridMuiInjectedProps`
 */
function buildFinalProps(
	props: JsocGridMuiProps,
	jsocGridContextValue: JsocGridContextValue
): DataGridProps {
	const { gridSchemaStore, noDefaultNavigator } = jsocGridContextValue;
	const gridSchema = getActiveGridSchema(gridSchemaStore);
	const {gridPlainRows, gridPrimaryColumnKey} = gridSchema;

	const showToolbar = props.showToolbar ?? true;
	const slots = props.slots ?? {};

	if (!slots.toolbar && !noDefaultNavigator) {
		slots.toolbar = DefaultToolbarMui;
	}

	const getRowId = (row: GridValidRowModel) => row[gridPrimaryColumnKey];

	const columns = generateColumns(
		gridPlainRows,
		gridSchema,
		gridPrimaryColumnKey,
		COLUMN_FACTORY_MUI,
		props.customColumnFactory
	);

	return {
		...filterSuppliedProps(props),
		showToolbar,
		slots,
		rows: gridPlainRows,
		getRowId,
		columns,
	};
}

function filterSuppliedProps(props: JsocGridMuiProps) {
	return deleteKeys(props, [...JSOC_GRID_MUI_CUSTOM_PROP_NAMES]);
}
//#endregion
