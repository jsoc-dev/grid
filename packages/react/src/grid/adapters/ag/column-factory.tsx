import { SubGridToggleButtonAg } from '../ag/components/SubGridToggleButton';
import { capitalizeFirst, toString } from '@jsoc/core';
import {
	buildGridId,
	buildSchemaForSubGrid,
	ColumnFactory,
	ColumnKey,
	GridSchema,
	type ColumnDataType,
	type ColumnDefinitionProviderParams,
	type GridData,
	type GridName,
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
			const { columnKey, gridSchema } = params;
			const { gridPrimaryColumnKey } = gridSchema;

			return (params: ICellRendererParams) => {
				const { data, value } = params;

				if (value) {
					const subGridSchema = buildSchemaForSubGrid(
						gridSchema,
						data[gridPrimaryColumnKey],
						columnKey,
						value
					);
					return (
						<SubGridToggleButtonAg subGridSchema={subGridSchema} />
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

				return toString(value);
			};
		},

		unresolved: function (params) {
			return this.string(params);
		},
	};
