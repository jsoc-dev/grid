import {
  exampleErrorMessageStyles,
  toExampleError,
} from "@jsoc/grid-examples-shared";
import {
  ErrorBoundary as ReactErrorBoundary,
  type ErrorBoundaryProps as ReactErrorBoundaryProps,
} from "react-error-boundary";

type ErrorBoundaryProps = Omit<
  ReactErrorBoundaryProps,
  "fallbackRender" | "fallback" | "FallbackComponent"
>;

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error }) => <ErrorMessage error={error} />}
      {...props}
    />
  );
}

function ErrorMessage({ error }: { error: unknown }) {
  const err = toExampleError(error);

  return (
    <div style={exampleErrorMessageStyles.container}>
      <p style={exampleErrorMessageStyles.title}>{err.name}</p>
      <div style={exampleErrorMessageStyles.message}>
        <pre style={exampleErrorMessageStyles.messagePre}>{err.message}</pre>
      </div>
    </div>
  );
}
