import { SubGridToggleButtonMui } from '../columns/SubGridToggleButton';
import { ensureString, capitalizeFirst } from '@jsoc/core';
import {
	buildSubGridSchema,
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
	const { columnKey, columnDataType } = params;

	return {
		field: columnKey,
		headerName: capitalizeFirst(columnKey),
		// TODO: add column type
		renderCell:
			DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI[columnDataType](params),
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
			const { columnKey, gridSchema, gridSchemaStore } = params;
			const { gridIdColumnKey } = gridSchema;

			return function (params: GridRenderCellParams) {
				const { row, value } = params;

				if (value) {
					const { subGridSchema, searchResult } = buildSubGridSchema(
						gridSchemaStore,
						gridSchema,
						{ rowId: row[gridIdColumnKey], columnKey },
						value
					);
					return (
						<SubGridToggleButtonMui
							searchResult={searchResult}
							subGridSchema={subGridSchema}
						/>
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
			return DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI.arrayOfObjects(
				params
			);
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

				return ensureString(value);
			};
		},

		unresolved: function (params) {
			return DEFAULT_CELL_RENDERER_PROVIDER_MAP_MUI.string(params);
		},
	};
