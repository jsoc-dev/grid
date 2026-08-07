import { LocalDataEditor } from "#examples/localData/LocalDataEditor.tsx";
import { useGetLocalData } from "#examples/localData/useLocalData.ts";
import type { ExampleRendererComponent } from "#examples/types.ts";
import { ErrorBoundary } from "#shared/ErrorBoundary.tsx";

import { getLocalDataEditorEnabled } from "@jsoc/grid-examples-core";

export type LocalDataExampleRendererProps = {
  component: ExampleRendererComponent;
};

export function LocalDataExampleRenderer({
  component: Component,
}: LocalDataExampleRendererProps) {
  const data = useGetLocalData();
  const showEditor = getLocalDataEditorEnabled();
  const editorEl = showEditor ? <LocalDataEditor /> : null;

  if (!data) return <>No data{editorEl}</>;

  return (
    <>
      <ErrorBoundary resetKeys={[data]}>
        <Component data={data} />
      </ErrorBoundary>
      {editorEl}
    </>
  );
}
