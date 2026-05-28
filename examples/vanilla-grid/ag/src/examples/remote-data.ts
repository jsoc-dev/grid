import { createAgGrid } from "#/utils/createAgGrid.ts";
import type { GridStore } from "@jsoc/grid-core";
import { createGridStore } from "@jsoc/vanilla-grid-ag";
import type { PluginConfigAg } from "@jsoc/vanilla-grid-ag";
import {
  subscribeRemoteJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export const renderRemoteDataExample: ExampleRenderer = (root) => {
  let gridApi: GridApi | undefined;
  let unsubscribeGridStore: (() => void) | undefined;

  const unsubscribeRemoteJSON = subscribeRemoteJSON((state) => {
    gridApi?.destroy();

    if (state.status === "loading") renderLoading(root);
    else if (state.status === "error") renderError(root, state.error);
    else {
      const gridStore = createGridStore(state.data);
      gridApi = renderGrid(root, gridStore);
      unsubscribeGridStore = gridStore.subscribe(() => {
        gridApi?.destroy();
        gridApi = renderGrid(root, gridStore);
      });
    }
  });

  return () => {
    gridApi?.destroy();
    unsubscribeGridStore?.();
    unsubscribeRemoteJSON();
  };
};

function renderLoading(container: HTMLElement) {
  container.replaceChildren();
  const message = document.createElement("p");
  message.textContent = "Loading...";
  container.appendChild(message);
}

function renderError(container: HTMLElement, error: Error) {
  container.replaceChildren();
  const message = document.createElement("p");
  message.textContent = `Error: ${error.message}`;
  container.appendChild(message);
}

function renderGrid(container: HTMLElement, store: GridStore<PluginConfigAg>) {
  container.replaceChildren();
  const activeSchema = store.getActiveSchema();
  return createAgGrid(container, activeSchema.config);
}
