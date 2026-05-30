import { ErrorMessage } from "#components/ErrorMessage.tsx";

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
