import { useFetchRemoteData } from "#examples/remoteData/useFetchRemoteData.ts";
import type { ExampleRendererComponent } from "#examples/types.ts";
import { ErrorMessage } from "#shared/ErrorMessage.tsx";

export type RemoteDataExampleRendererProps = {
  component: ExampleRendererComponent;
};

export function RemoteDataExampleRenderer({
  component: Component,
}: RemoteDataExampleRendererProps) {
  const { data, error, isLoading, isError } = useFetchRemoteData();

  if (isLoading) return "Loading...";
  if (isError) return <ErrorMessage error={error} />;

  return <Component data={data} />;
}
