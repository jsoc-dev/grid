import { Component, type ReactNode } from "react";

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
    if (this.state.error) {
      const cause =
        this.state.error.cause instanceof Error
          ? this.state.error.cause.message
          : String(this.state.error.cause);
      return (
        <>
          <p className="message message--error">{this.state.error.message}</p>
          {cause && <p>Cause: {cause}</p>}
        </>
      );
    }

    return this.props.children;
  }
}
