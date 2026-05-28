import {
  subscribeLocalJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";

import { createAgGrid } from "#/utils/createAgGrid.ts";
import type { GridApi } from "ag-grid-community";
import { createGridStore, type PluginConfigAg } from "@jsoc/vanilla-grid-ag";
import type { GridStore } from "@jsoc/grid-core";

export const renderLocalDataExample: ExampleRenderer = (root) => {
  let gridApi: GridApi | undefined;
  let unsubscribeGridStore: (() => void) | undefined;

  const unsubscribeLocalJSON = subscribeLocalJSON((data) => {
    // destroy the previous gridApi as the new structure of the new data can be different than the previous one,
    // Use gridApi?.updateGridOptions() instead if you are sure that the structure of the data is the same.
    gridApi?.destroy();

    if (!data) return renderNoData(root);

    const gridStore = createGridStore(data);
    gridApi = renderGrid(root, gridStore);

    unsubscribeGridStore = gridStore.subscribe(() => {
      gridApi?.destroy();
      gridApi = renderGrid(root, gridStore);
    });
  });

  return () => {
    gridApi?.destroy();
    unsubscribeGridStore?.();
    unsubscribeLocalJSON();
  };
};

function renderNoData(container: HTMLElement) {
  container.replaceChildren();
  const para = document.createElement("p");
  para.textContent = "No data";
  container.appendChild(para);
}

function renderGrid(container: HTMLElement, store: GridStore<PluginConfigAg>) {
  container.replaceChildren();
  const activeSchema = store.getActiveSchema();
  return createAgGrid(container, activeSchema.config);
}
