import {
  subscribeLocalJSON,
  type ExampleMount,
} from "@jsoc/vanilla-grid-examples";

import { createAgGridMount } from "../utils/mountAgGrid.ts";

export const mountLocalData: ExampleMount = (root) => {
  let disposeGrid: (() => void) | undefined;

  function render(json: string | undefined) {
    disposeGrid?.();
    disposeGrid = undefined;
    root.replaceChildren();

    if (!json) {
      const message = document.createElement("p");
      message.textContent = "No data";
      root.appendChild(message);
      return;
    }

    disposeGrid = createAgGridMount(json)(root);
  }

  const unsubscribe = subscribeLocalJSON(render);

  return () => {
    unsubscribe();
    disposeGrid?.();
    root.replaceChildren();
  };
};
