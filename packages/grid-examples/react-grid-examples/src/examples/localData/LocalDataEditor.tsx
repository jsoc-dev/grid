import "@jsoc/grid-examples-core/css/local-data-editor.css";

import {
  useGetLocalData,
  useSetLocalData,
} from "#examples/localData/useLocalData.ts";

import { useState } from "react";

/** JSON editor for standalone local data examples. */
export function LocalDataEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const localData = useGetLocalData();
  const [draft, setDraft] = useState(localData);

  useSetLocalData(draft);

  return (
    <div className="local-data-editor">
      {isOpen && (
        <textarea
          className="local-data-editor__textarea"
          aria-label="Local JSON data"
          placeholder="Enter JSON"
          spellCheck={false}
          value={draft ?? ""}
          onChange={(event) => setDraft(event.target.value)}
        />
      )}
      <button
        type="button"
        className={
          isOpen
            ? "local-data-editor__toggle local-data-editor__toggle--close"
            : "local-data-editor__toggle local-data-editor__toggle--edit"
        }
        aria-label={isOpen ? "Close JSON editor" : "Edit local JSON data"}
        onClick={() => setIsOpen((open) => !open)}
      />
    </div>
  );
}
