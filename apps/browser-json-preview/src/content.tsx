import { App } from "#App.tsx";
import { setActiveView } from "#utils/dom.ts";
import { isJsonContentType } from "#utils/json.ts";
import { getDefaultViewSetting } from "#utils/settings.ts";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

async function init() {
  if (!isJsonContentType(document.contentType)) return;

  setActiveView(getDefaultViewSetting());

  if (document.readyState === "loading") {
    await new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve, { once: true }),
    );
  }

  const host = document.createElement("div");
  host.id = "json-preview-host";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  createRoot(shadowRoot).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void init();
