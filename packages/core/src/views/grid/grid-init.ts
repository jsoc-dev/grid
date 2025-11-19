import { isPlainObject, PlainObject } from '../../util/object';
import { isString } from '../../util/string';
import { JsocDataParseError } from '../../errors';
import { GridSchemaStack } from './grid-navigation';

// EXPORTS
export type GridKey = string;
export type GridData = unknown;

export function init(
	gridKey: GridKey,
	gridData: GridData,
): GridSchemaStack {
	if (isString(gridData)) {
		try {
			gridData = JSON.parse(gridData);
		} catch (error) {
			console.log(error);
			throw new JsocDataParseError(
				'Unable to parse the JSON String.',
				gridData
			);
		}
	}

	if (isPlainObject(gridData)) {
		const resultKeys = Object.keys(gridData);
		const resultFirstKey = resultKeys[0];
		const resultFirstValue = gridData[resultFirstKey];
		if (
			resultKeys.length === 1 && 
			resultFirstKey === gridKey
		) {
			gridData = resultFirstValue;
		}
	}

	return [
		{
			gridKey,
			gridData,
			isActiveGrid: true,
		},
	];
}
