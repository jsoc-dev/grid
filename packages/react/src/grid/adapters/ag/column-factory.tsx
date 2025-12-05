import { SubGridToggleButtonAg } from '../ag/components/SubGridToggleButton';
import { capitalizeFirst, ensureString } from '@jsoc/core';
import {
	buildSubGridSchema,
	ColumnFactory,
	type ColumnDataType,
	type ColumnDefinitionProviderParams,
} from '@jsoc/core/grid';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';

export const COLUMN_FACTORY_AG: ColumnFactory<ColDef> = {
	arrayOfObjects: defaultColumnDefinitionProviderAg,
	arrayOfStrings: defaultColumnDefinitionProviderAg,
	boolean: defaultColumnDefinitionProviderAg,
	number: defaultColumnDefinitionProviderAg,
	object: defaultColumnDefinitionProviderAg,
	stringDate: defaultColumnDefinitionProviderAg,
	string: defaultColumnDefinitionProviderAg,
	unresolved: defaultColumnDefinitionProviderAg,
};

export function defaultColumnDefinitionProviderAg(
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
			const { columnKey, gridSchema, gridSchemaStore } = params;
			const { gridIdColumnKey } = gridSchema;

			return (params: ICellRendererParams) => {
				const { data, value } = params;

				if (value) {
					const { subGridSchema, searchResult } = buildSubGridSchema(
						gridSchemaStore,
						gridSchema,
						{ rowId: data[gridIdColumnKey], columnKey },
						value
					);
					return (
						<SubGridToggleButtonAg
							subGridSchema={subGridSchema}
							searchResult={searchResult}
						/>
					);
				}
			};
		},

		arrayOfStrings: function (params) {
			return (params: ICellRendererParams) => {
				const { value } = params;

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
				const { value } = params;

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
