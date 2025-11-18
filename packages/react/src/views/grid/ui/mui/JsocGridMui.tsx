// _____________________ IMPORTS __________________
import { useContext } from 'react';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { generateColumnsSchema, SubsetKeysOf } from '@jsoc/core';
import { GridNavigatorStackItem, JsocGridContext } from '../../JsocGridContext';
import { COLUMN_FACTORY } from './helpers/column-factory';
import { generateColumns } from '@jsoc/core';
import { mergeProps } from './helpers/merge-props';
import { normaliseRows } from './helpers/rows-normalisor';

// _____________________ TYPES STARTED__________________
export type JsocGridMuiDynamicPropNames = SubsetKeysOf<
	DataGridProps,
	'rows' | 'columns'
>;

export type JsocGridMuiProps = Omit<DataGridProps, JsocGridMuiDynamicPropNames>;

export type JsocGridMuiDynamicProps = Pick<
	DataGridProps,
	JsocGridMuiDynamicPropNames
>;

// _____________________ TYPES ENDED____________________

// NOTE: At runtime, even if parent doesn't send any props,
// React will still pass an empty object {} for adapterProps.
export function JsocGridMui(props: JsocGridMuiProps) {
	const { gridNavigatorStack } = useContext(JsocGridContext);

	const { gridKey, gridData } = gridNavigatorStack.at(
		-1
	) as GridNavigatorStackItem;

	const rows = normaliseRows(gridData);
	const columns = generateColumns<GridColDef>(gridData, COLUMN_FACTORY);
	const mergedProps = mergeProps(props, { rows, columns });
	return <DataGrid {...mergedProps} />;
}
