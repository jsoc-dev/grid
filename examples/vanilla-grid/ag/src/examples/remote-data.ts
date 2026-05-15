import {
  subscribeRemoteJSON,
  type ExampleMount,
  type RemoteJSONState,
} from "@jsoc/vanilla-grid-examples";

import { createAgGridMount } from "../utils/mountAgGrid.ts";

export const mountRemoteData: ExampleMount = (root) => {
  let disposeGrid: (() => void) | undefined;

  function render(state: RemoteJSONState) {
    disposeGrid?.();
    disposeGrid = undefined;
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

    disposeGrid = createAgGridMount(state.data)(root);
  }

  const unsubscribe = subscribeRemoteJSON(render);
  return () => {
    unsubscribe();
    disposeGrid?.();
    root.replaceChildren();
  };
};
