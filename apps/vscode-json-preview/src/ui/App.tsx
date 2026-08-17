import { ErrorBoundary } from "#ui/components/ErrorBoundary.tsx";
import { Placeholder } from "#ui/components/Placeholder.tsx";
import { Preview } from "#ui/components/preview/Preview.tsx";
import { removeComments, removeTrailingCommas } from "#ui/utils/json.ts";
import { useDoubleClickToSwitchToEditor } from "#ui/hooks/useDoubleClickToSwitchToEditor.ts";
import { usePreviewFile } from "#ui/hooks/usePreviewFile.ts";

export function App() {
  const file = usePreviewFile();
  useDoubleClickToSwitchToEditor();

  if (!file.json.trim())
    return <Placeholder type="info" title="JSON is empty." />;

  const previewFile = {
    ...file,
    json: removeTrailingCommas(removeComments(file.json)),
  };

  return (
    <ErrorBoundary resetKey={previewFile.json}>
      <Preview file={previewFile} />
    </ErrorBoundary>
  );
}
