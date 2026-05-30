import { createAgGrid } from "#/utils/createAgGrid.ts";
import { ensureError } from "@jsoc/utils";

import { createGridStore, type GridStoreAg } from "@jsoc/vanilla-grid-ag";
import {
  subscribeLocalJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export const renderLocalDataExample: ExampleRenderer = (root) => {
  let gridApi: GridApi | undefined;
  let gridStore: GridStoreAg | undefined;

  const unsubscribeLocalJSON = subscribeLocalJSON((data) => {
    if (!data) {
      renderNoData(root);
      return;
    }

    try {
      gridStore?.destroy();
      gridStore = createGridStore({
        data,
        listener: ({ gridStore }) => {
          const gridOptions = gridStore.getActiveSchema().config;
          root.replaceChildren();
          gridApi?.destroy();
          gridApi = createAgGrid(root, gridOptions);
        },
      });
    } catch (error) {
      renderError(root, error);
    }
  });

  return () => {
    gridApi?.destroy();
    gridStore?.destroy();
    unsubscribeLocalJSON();
  };
};

function renderNoData(container: HTMLElement) {
  const message = document.createElement("p");
  message.textContent = "No data";
  container.replaceChildren(message);
}

function renderError(container: HTMLElement, error: unknown) {
  const err = ensureError(error);
  const message = document.createElement("p");
  message.textContent = `Error: ${err.message}`;
  container.replaceChildren(message);
}
