import { SubGridToggleButtonMui } from '@/grid';
import { toString, capitalizeFirst } from '@jsoc/core';
import {
	buildSchemaForSubGrid,
	ColumnFactory,
	type ColumnDataType,
	type ColumnDefinitionProviderParams,
} from '@jsoc/core/grid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import type { GridBaseColDef } from '@mui/x-data-grid/internals';

export const COLUMN_FACTORY_MUI: ColumnFactory<GridColDef> = {
	arrayOfObjects: defaultColumnDefinitionProviderMui,
	arrayOfStrings: defaultColumnDefinitionProviderMui,
	boolean: defaultColumnDefinitionProviderMui,
	number: defaultColumnDefinitionProviderMui,
	object: defaultColumnDefinitionProviderMui,
	stringDate: defaultColumnDefinitionProviderMui,
	string: defaultColumnDefinitionProviderMui,
	unresolved: defaultColumnDefinitionProviderMui,
};

export function defaultColumnDefinitionProviderMui(
	params: ColumnDefinitionProviderParams
): GridColDef {
	const { columnKey, columnDataType, primaryColumnKey, gridSchema } = params;
	const getRenderer = DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI[columnDataType];
	const renderCell = getRenderer(params);
	return {
		field: columnKey,
		headerName: capitalizeFirst(columnKey),
		// TODO: add column type
		renderCell,
	};
}

export type CellRendererMui = GridBaseColDef['renderCell'];
export type DefaultCellRendererProviderMapMui = Record<
	ColumnDataType,
	(params: ColumnDefinitionProviderParams) => CellRendererMui
>;
export const DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI: DefaultCellRendererProviderMapMui =
	{
		arrayOfObjects: function (params) {
			const { columnKey, primaryColumnKey, gridSchema } = params;

			return function (params: GridRenderCellParams) {
				const { row, value } = params;

				if (value) {
					const subGridSchema = buildSchemaForSubGrid(
						gridSchema,
						row[primaryColumnKey],
						columnKey,
						value
					);
					return (
						<SubGridToggleButtonMui subGridSchema={subGridSchema} />
					);
				}
			};
		},

		arrayOfStrings: function (params) {
			return (params: GridRenderCellParams) => {
				const { row, value } = params;

				return 'Array of string column'; // TODO
			};
		},

		boolean: function (params) {
			return (params: GridRenderCellParams) => {
				const { value } = params;

				return value;
			};
		},

		number: function (params) {
			return (params: GridRenderCellParams) => {
				const { value } = params;

				return value;
			};
		},

		object: function (params) {
			return DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI.arrayOfObjects(params);
		},

		stringDate: function (params) {
			return (params: GridRenderCellParams) => {
				const { row, value } = params;

				return 'Date Column'; // TODO
			};
		},

		string: function (params) {
			return (params: GridRenderCellParams) => {
				const { row, value } = params;

				return toString(value);
			};
		},

		unresolved: function (params) {
			return DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI.string(params);
		},
	};
