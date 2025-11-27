import { joinStringArray } from '../utils';

export class JsocError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'JsocError';
	}
}

export class JsocConfigurationError extends JsocError {
	constructor(message: string) {
		super(message);
		this.name = 'JsocConfigurationError';
	}
}

// subclasses of JsocConfigurationError
export class JsocInvalidAdapterError extends JsocConfigurationError {
	constructor(view: string, adapter: string, supportedAdapters: string[]) {
		const supportedAdaptersJoined = joinStringArray(supportedAdapters);
		const richMessage = `"${adapter}" is not a valid adapter for view "${view}". Supported adapters are: ${supportedAdaptersJoined}.`;
		super(richMessage);
	}
}

export class JsocGridError extends JsocError {
	constructor(public message: string) {
		super(message);
		this.name = 'JsocGridError';
	}
}
