import "#content.css";

import { App } from "#App.tsx";
import { isJsonContentType } from "#utils/json.ts";

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function init() {
  if (!isJsonContentType(document.contentType)) return;

  const root = document.createElement("div");
  root.id = "json-preview-root";
  document.body.appendChild(root);

  createRoot(root).render(
    <StrictMode>
      <PreviewToggle />
    </StrictMode>,
  );
}

function PreviewToggle() {
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const browserPreviewNodes = Array.from(document.body.children).filter(
      (node) => node instanceof HTMLElement && node.id !== "json-preview-root",
    ) as HTMLElement[];

    browserPreviewNodes.forEach((node) => {
      node.style.display = showTable ? "none" : "";
    });
  }, [showTable]);

  return (
    <>
      <label
        className={`json-preview-toggle ${showTable ? "docked" : "floating"}`}
      >
        Table Preview
        <input
          type="checkbox"
          checked={showTable}
          onChange={(e) => setShowTable(e.target.checked)}
        />
      </label>

      {showTable && <App />}
    </>
  );
}

init();
