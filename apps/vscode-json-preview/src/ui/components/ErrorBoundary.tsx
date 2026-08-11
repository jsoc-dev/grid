import { Placeholder } from "#ui/components/Placeholder.tsx";
import { Component, type ReactNode } from "react";
import { isError } from "@jsoc/utils";

type ErrorBoundaryProps = {
  children: ReactNode;
  resetKey: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const error = this.state.error;
    if (!error) return this.props.children;

    const details =
      isError(error.cause) && error.cause.message ? error.cause.message : null;

    return (
      <Placeholder type="error" title={error.message} description={details} />
    );
  }
}
