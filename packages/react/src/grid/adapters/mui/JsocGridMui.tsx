import { JsocGridContext } from '../../wrapper';
import { useRestoreGridParentFocus } from './hooks';
import { COLUMN_FACTORY_MUI, DefaultToolbarMui } from './default';
import { SubsetKeysOf, deleteKeys } from '@jsoc/core';
import {
	generateColumns,
	getActiveGridSchema,
	CustomColumnFactory,
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

/**
 * Adapter component for MUI DataGrid
 */
export function JsocGridMui(props: JsocGridMuiProps) {
	const apiRef = useGridApiRef();
	const { gridSchemaStore, showDefaultNavigator } =
		useContext(JsocGridContext);
	useRestoreGridParentFocus(apiRef, gridSchemaStore); // TODO: remove this and try to persist grid states (using Activity and rendering all grids as list items)

	const gridSchema = getActiveGridSchema(gridSchemaStore);
	const { gridId, gridPrimaryColumnKey, gridPlainRows } = gridSchema;
	/**
	 * TODO: Memoise col defs (as suggested at https://mui.com/x/react-data-grid/column-definition/#:~:text=The%20columns%20prop%20should,function%20or%20memoize%20it.)
	 * useMemo didnt solve the issue, grid states are still being reset
	*/
	const columns = useMemo(
		() =>
			generateColumns(
				gridSchema,
				COLUMN_FACTORY_MUI,
				props.customColumnFactory
			),
		[gridSchema, props.customColumnFactory]
	);

	const getRowId: GridRowIdGetter = (row) => row[gridPrimaryColumnKey];
	const showToolbar = showDefaultNavigator || props.showToolbar;
	const slots = {
		...props.slots,
		...(showDefaultNavigator && {
			toolbar: DefaultToolbarMui,
		}),
	};
	const userSuppliedProps = deleteKeys(props, [
		...JSOC_GRID_MUI_CUSTOM_PROP_NAMES,
	]);

	return (
		<JsocGridMuiContext.Provider value={{ apiRef }}>
			<DataGrid
				{...userSuppliedProps}
				/**
				 * gridId is used as key so that DataGrid is remounted when gridSchemaStore is changed.
				 * This is necessary as MUI `DataGrid` internal states (like scroll position) does not
				 * reset across rerenders unless the component is fully remounted, due to which the scroll
				 * position persists even if the previous grid schema and current grid schemas are different.
				 * Also, the events like "focus lose" of old grid cells still continue to happen which causes
				 * code breaks as the previous grid cell won't be rendered in the current grid.
				 * TODO: Try to achieve this using list items
				 */
				key={gridId}
				apiRef={apiRef}
				rows={gridPlainRows}
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

/**
 * Props that customise or disable the `JsocGrid` features
 * These props are not part of DataGridProps as they don't exist in MUI DataGrid
 */
export type JsocGridMuiCustomProps = {
	customColumnFactory?: CustomColumnFactory<GridColDef>;
};
export type JsocGridMuiCustomPropNames = keyof JsocGridMuiCustomProps;
/**
 * List of names of all the Custom Props.
 * Using this list, custom props will be removed from supplied props before passing to `DataGrid`
 */
export const JSOC_GRID_MUI_CUSTOM_PROP_NAMES: Array<JsocGridMuiCustomPropNames> =
	['customColumnFactory'];

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
