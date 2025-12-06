import { ToggleSubGridButton } from '../../../components';
import {
	ensureArray,
	ensureString,
	isArray,
	isPlainObject,
	encodePretty,
	toReadableString,
} from '@jsoc/core/utils';
import {
	ColumnFactory,
	type ColumnDataType,
	type ColumnDefinitionProviderParams,
} from '@jsoc/core/grid';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

export const COLUMN_FACTORY_AG: ColumnFactory<ColDef> = {
	arrayOfObjects,
	boolean,
	number,
	object,
	stringDate,
	string,
	unresolved,
};

export function commonColDefAg(params: ColumnDefinitionProviderParams): ColDef {
	const { columnKey } = params;

	return {
		field: columnKey,
		headerName: toReadableString(columnKey),
		filter: true,
	};
}

export type CellRendererAg = ColDef['cellRenderer'];
export type DefaultCellRendererProviderMapAg = Record<
	ColumnDataType,
	(params: ColumnDefinitionProviderParams) => CellRendererAg
>;

function string(params: ColumnDefinitionProviderParams): ColDef {
	return {
		...commonColDefAg(params),
		cellDataType: 'text',
	};
}

function boolean(params: ColumnDefinitionProviderParams): ColDef {
	return {
		...commonColDefAg(params),
		cellDataType: 'boolean',
	};
}

function number(params: ColumnDefinitionProviderParams): ColDef {
	return {
		...commonColDefAg(params),
		cellDataType: 'number',
	};
}

function stringDate(params: ColumnDefinitionProviderParams): ColDef {
	return {
		...commonColDefAg(params),
		cellDataType: 'dateTimeString',
	};
}

/**
 * Provides column definitions for column having values as arrayOfObjects
 */
function arrayOfObjects(params: ColumnDefinitionProviderParams): ColDef {
	const { columnKey, gridId, gridIdColumnKey } = params;

	return {
		...commonColDefAg(params),
		cellDataType: 'object',
		sortable: false,
		filter: false,
		valueFormatter: (params) => {
			const { value } = params;

			return encodePretty(value);
		},
		/**
		 * Returns a button that allows toggling SubGrid which represents the data for this column.
		 */
		cellRenderer: (params: ICellRendererParams) => {
			const { data, value } = params;

			return (
				<ToggleSubGridButton
					subGridData={ensureArray(value)}
					parentGridId={gridId}
					parentGridCellLocation={{
						rowId: data[gridIdColumnKey],
						columnKey,
					}}
				/>
			);
		},
	};
}

function object(params: ColumnDefinitionProviderParams): ColDef {
	return arrayOfObjects(params);
}

function unresolved(params: ColumnDefinitionProviderParams): ColDef {
	return {
		...commonColDefAg(params),
		sortable: false,
		filter: false,
		/**
		 * Converting the value to a string.
		 */
		valueFormatter: (params) => {
			const { value } = params;

			if (isArray(value)) {
				if (value.some((x) => isPlainObject(x) || isArray(x))) {
					return encodePretty(value);
				} else {
					return value.join(', ');
				}
			}

			return ensureString(value);
		},
	};
}
