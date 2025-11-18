import { JsocError } from './JsocError';

export class JsocDataParseError extends JsocError {
	constructor(message: string, data: unknown) {
		super(message + ' Data: ' + JSON.stringify(data));
		this.name = 'JsocDataParseError';
	}
}

// sub classes of JsocDataParseError
