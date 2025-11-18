import { XMLParser } from 'fast-xml-parser';
import { JsocDataParseError } from '../errors';

export function isString(arg: unknown): arg is string {
	return typeof arg === 'string';
}

export function isJSONString(arg: unknown): arg is string {
	if (isString(arg)) {
		const str = arg.trim();
		return (
			(str.startsWith('{') && str.endsWith('}')) ||
			(str.startsWith('[') && str.endsWith(']'))
		);
	}

	return false;
}

export function isXMLString(arg: unknown): arg is string {
	if (isString(arg)) {
		const str = arg.trim();
		return str.startsWith('<') && str.endsWith('>');
	}

	return false;
}

export function parseString(str: string): unknown {
	if (isJSONString(str)) {
		try {
			return JSON.parse(str);
		} catch (error) {
			console.log(error);
			throw new JsocDataParseError('Unable to parse the JSON String.', str);
		}
	} else if (isXMLString(str)) {
		try {
			const xmlParser = new XMLParser();
			return xmlParser.parse(str);
		} catch (error) {
			console.log(error);
			throw new JsocDataParseError('Unable to parse the XML String.', str);
		}
	} else {
		throw new JsocDataParseError('Data String is neither JSON nor XML.', str);
	}

	// the structure of parsed result here is not being validated here
	// validation will be done at view component
	// as the expected structure will vary depending on the view
	// example: for grid view, expected structure can be array or an object
}