import { createAgGrid } from "#/utils/createAgGrid.ts";

import type { GridStore } from "@jsoc/grid-core";
import { shoeJSON } from "@jsoc/grid-examples-shared";
import { createGridStore } from "@jsoc/vanilla-grid-ag";
import type { PluginConfigAg } from "@jsoc/vanilla-grid-ag";
import type { ExampleRenderer } from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export const renderBasicExample: ExampleRenderer = (root) => {
  let gridApi: GridApi | undefined;

  const gridStore = createGridStore(shoeJSON);

  gridApi = renderGrid(root, gridStore);

  const unsubscribeGridStore = gridStore.subscribe(() => {
    // whenever the grid store state changes, the new grid options will be different than the previous one.
    // But AG Grid doesn't allow some grid options (Initial options) to be updated after initialisation, see
    // https://www.ag-grid.com/vue-data-grid/grid-interface/#initial-grid-options for more details.
    // So, we need to destroy the previous grid and re-create it.
    gridApi?.destroy();
    gridApi = renderGrid(root, gridStore);
  });

  return () => {
    gridApi?.destroy();
    unsubscribeGridStore();
  };
};

function renderGrid(container: HTMLElement, store: GridStore<PluginConfigAg>) {
  const activeSchema = store.getActiveSchema();
  return createAgGrid(container, activeSchema.config);
}
