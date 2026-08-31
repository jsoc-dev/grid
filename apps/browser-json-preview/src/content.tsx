import { App } from "#App.tsx";
import { isJsonContentType } from "#utils/json.ts";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

(function () {
  if (!isJsonContentType(document.contentType)) return;

  const host = document.createElement("div");
  host.id = "json-preview-host";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  createRoot(shadowRoot).render(
    <StrictMode>
      <App host={host} />
    </StrictMode>,
  );
})();
