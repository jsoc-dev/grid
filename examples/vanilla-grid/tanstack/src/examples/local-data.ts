import {
  subscribeLocalJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";

import { createTanstackTableMount } from "./mountTanstackTable.ts";

export const renderLocalDataExample: ExampleRenderer = (root) => {
  let disposeTable: (() => void) | undefined;

  function render(json: string | undefined) {
    disposeTable?.();
    disposeTable = undefined;
    root.replaceChildren();

    if (!json) {
      const message = document.createElement("p");
      message.textContent = "No data";
      root.appendChild(message);
      return;
    }

    disposeTable = createTanstackTableMount(json)(root);
  }

  const unsubscribe = subscribeLocalJSON(render);
  return () => {
    unsubscribe();
    disposeTable?.();
    root.replaceChildren();
  };
};
