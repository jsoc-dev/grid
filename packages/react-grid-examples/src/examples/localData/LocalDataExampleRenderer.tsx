import { useGetLocalData } from "#examples/localData/useLocalData.ts";
import type { ExampleRendererComponent } from "#examples/types.ts";
import { ErrorBoundary } from "#shared/ErrorBoundary.tsx";

export type LocalDataExampleRendererProps = {
  component: ExampleRendererComponent;
};

export function LocalDataExampleRenderer({
  component: Component,
}: LocalDataExampleRendererProps) {
  const data = useGetLocalData();

  if (!data) return "No data";

  return (
    <ErrorBoundary resetKeys={[data]}>
      <Component data={data} />
    </ErrorBoundary>
  );
}
