// _____________________ IMPORTS __________________
import { useContext } from 'react';
import { DataGrid, DataGridProps, GridRowsProp } from '@mui/x-data-grid';
import { SubsetKeysOf } from '@jsoc/core';
import {
	AUTO_GENERATED_PREFIXER,
	generateColumns,
	generateRows,
	getActive,
	GridPlainRows,
	GridSchemaStack,
} from '@jsoc/core/grid';
import { JsocGridContext } from '../../JsocGridContext';
import { COLUMN_FACTORY } from './helpers/column-factory';
import { JsocGridNavigator } from '../../components/JsocGridNavigator';

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

export function JsocGridMui(props: JsocGridMuiProps) {
	const { gridSchemaStack } = useContext(JsocGridContext);
	const defaultProps = getDefaultProps();
	const dynamicProps = getDynamicProps(gridSchemaStack);

	const mergedProps: DataGridProps = {
		...defaultProps,
		...props,
		...dynamicProps,
	};
	return (
		<>
			<JsocGridNavigator />
			<DataGrid {...mergedProps} />
		</>
	);
}

function getDefaultProps(): JsocGridMuiProps {
	return {
		showToolbar: true,
	};
}

function getDynamicProps(
	gridSchemaStack: GridSchemaStack
): JsocGridMuiDynamicProps {
	const { gridData } = getActive(gridSchemaStack);
	const plainRows = generateRows(gridData);
	const rows = getMuiGridRows(plainRows);
	const columns = generateColumns(plainRows, COLUMN_FACTORY);

	return {
		rows,
		columns,
	};
}

function getMuiGridRows(plainRows: GridPlainRows): GridRowsProp {
	const muiRows: GridRowsProp = Array.from(plainRows);
	for (const row of muiRows) {
		if (!('id' in row)) {
			row.id = AUTO_GENERATED_PREFIXER + crypto.randomUUID();
		}
	}

	return muiRows;
}
