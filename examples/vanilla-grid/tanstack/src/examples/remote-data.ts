import {
  subscribeRemoteJSON,
  type ExampleRenderer,
  type RemoteJSONState,
} from "@jsoc/vanilla-grid-examples";

import { createTanstackTableMount } from "./mountTanstackTable.ts";

export const renderRemoteDataExample: ExampleRenderer = (root) => {
  let disposeTable: (() => void) | undefined;

  function render(state: RemoteJSONState) {
    disposeTable?.();
    disposeTable = undefined;
    root.replaceChildren();

    if (state.status === "loading") {
      const message = document.createElement("p");
      message.textContent = "Loading...";
      root.appendChild(message);
      return;
    }

    if (state.status === "error") {
      const message = document.createElement("p");
      message.textContent = `Error: ${state.error.message}`;
      root.appendChild(message);
      return;
    }

    disposeTable = createTanstackTableMount(state.data)(root);
  }

  const unsubscribe = subscribeRemoteJSON(render);
  return () => {
    unsubscribe();
    disposeTable?.();
    root.replaceChildren();
  };
};
