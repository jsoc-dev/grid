import { Component, ReactNode } from 'react';
import { JsocErrorFallback } from './JsocErrorFallback';

type JsocErrorBoundaryProps = {
	// fallback: ReactNode;
	children: ReactNode;
};

type JsocErrorBoundaryStates = {
	error?: Error;
};

export class JsocErrorBoundary extends Component<
	JsocErrorBoundaryProps,
	JsocErrorBoundaryStates
> {
	state: JsocErrorBoundaryStates = {};

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidCatch(error: Error, info: { componentStack: string }) {}

	render() {
		if (this.state.error) {
			return <JsocErrorFallback error={this.state.error} />;
		}
		return this.props.children;
	}
}
