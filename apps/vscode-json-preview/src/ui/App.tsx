import { ErrorBoundary } from "#ui/components/ErrorBoundary.tsx";
import { Preview } from "#ui/components/preview/Preview.tsx";
import { removeComments, removeTrailingCommas } from "#ui/utils/json.ts";
import { usePreviewFile } from "#ui/hooks/usePreviewFile.ts";

export function App() {
  const file = usePreviewFile();

  if (!file.json.trim()) return <p className="message">JSON is empty.</p>;

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
