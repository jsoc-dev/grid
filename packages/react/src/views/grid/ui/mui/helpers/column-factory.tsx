import {
	ensureArray,
	getImageHtmlString,
	isImageLink,
	isPlainObject,
	joinImageOrStringValues,
	ColumnKey,ColumnFactory
} from '@jsoc/core';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { JsocGridExpander } from '../../../components/JsocGridExpander';


export const COLUMN_FACTORY: ColumnFactory<GridColDef> = {
	string: getNewTextColumn,
	date: getNewDateColumn,
	nested: getNewExpanderColumn,
};

export function getNewTextColumn(id: ColumnKey): GridColDef {
	return {
		field: id,
		headerName: id,
		renderCell: (params: GridRenderCellParams) => {
			const { row, value } = params;
			row;

			if (Array.isArray(value)) {
				return joinImageOrStringValues(value);
			}
			if (isImageLink(value)) {
				return getImageHtmlString(value);
			}
			return value;
		},
	};
}

export function getNewDateColumn(id: ColumnKey): GridColDef {
	return {
		field: id,
		headerName: id,
		renderCell: (params: GridRenderCellParams) => {
			params.value;

			return 'Date Col';
		},
	};
}

export function getNewExpanderColumn(id: ColumnKey): GridColDef {
	return {
		field: id,
		headerName: id,
		renderCell: (params: GridRenderCellParams) => {
			const { row, value } = params;
			row;
			if (isPlainObject(value) || Array.isArray(value)) {
				const gridData = ensureArray(value);
				return <JsocGridExpander gridKey={id} gridData={gridData} />;
			}
		},
	};
}
