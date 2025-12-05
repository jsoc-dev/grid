import { ToggleSubGridButtonAg } from './ToggleSubGridButton';
import { capitalizeFirst, ensureString } from '@jsoc/core';
import {
	ColumnFactory,
	type ColumnDataType,
	type ColumnDefinitionProviderParams,
} from '@jsoc/core/grid';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

export const COLUMN_FACTORY_AG: ColumnFactory<ColDef> = {
	arrayOfObjects: colDefProviderAg,
	arrayOfStrings: colDefProviderAg,
	boolean: colDefProviderAg,
	number: colDefProviderAg,
	object: colDefProviderAg,
	stringDate: colDefProviderAg,
	string: colDefProviderAg,
	unresolved: colDefProviderAg,
};

export function colDefProviderAg(
	params: ColumnDefinitionProviderParams
): ColDef {
	const { columnKey, columnDataType } = params;

	return {
		field: columnKey,
		headerName: capitalizeFirst(columnKey),
		filter: true,
		cellRenderer:
			DEFAULT_CELL_RENDERER_PROVIDER_MAP_AG[columnDataType](params),
	};
}

export type CellRendererAg = ColDef['cellRenderer'];
export type DefaultCellRendererProviderMapAg = Record<
	ColumnDataType,
	(params: ColumnDefinitionProviderParams) => CellRendererAg
>;

export const DEFAULT_CELL_RENDERER_PROVIDER_MAP_AG: DefaultCellRendererProviderMapAg =
	{
		arrayOfObjects: function (params) {
			const { columnKey, gridId, gridIdColumnKey } = params;

			return (params: ICellRendererParams) => {
				const { data, value } = params;

				if (value) {
					return (
						<ToggleSubGridButtonAg
							subGridData={value}
							parentGridId={gridId}
							parentGridCellLocation={{
								rowId: data[gridIdColumnKey],
								columnKey,
							}}
						/>
					);
				}
			};
		},

		arrayOfStrings: function (params) {
			return (params: ICellRendererParams) => {
				// const { value } = params;

				return 'Array of string column'; // TODO
			};
		},

		boolean: function (params) {
			return (params: ICellRendererParams) => {
				const { value } = params;

				return value;
			};
		},

		number: function (params) {
			return (params: ICellRendererParams) => {
				const { value } = params;

				return value;
			};
		},

		object: function (params) {
			return this.arrayOfObjects(params);
		},

		stringDate: function (params) {
			return (params: ICellRendererParams) => {
				// const { value } = params;

				return 'Date Column'; // TODO
			};
		},

		string: function (params) {
			return (params: ICellRendererParams) => {
				const { value } = params;

				return ensureString(value);
			};
		},

		unresolved: function (params) {
			return this.string(params);
		},
	};
