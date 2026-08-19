import { ErrorBoundary } from "#components/ErrorBoundary.tsx";
import { Placeholder } from "#components/Placeholder.tsx";
import { Preview } from "#components/preview/Preview.tsx";
import { parseJsonFromText } from "#utils/json.ts";

export function App() {
  const text = document.body.getElementsByTagName("pre")[0]?.textContent;
  const json = parseJsonFromText(text);

  if (json === undefined)
    return <Placeholder type="error" title="Invalid JSON" description={text} />;

  if (json.trim() === "")
    return <Placeholder type="info" title="JSON is empty." />;

  const fileName = window.location.pathname.split("/").pop() || "document.json";

  return (
    <ErrorBoundary resetKey={json}>
      <Preview file={{ fileName, json }} />
    </ErrorBoundary>
  );
}
