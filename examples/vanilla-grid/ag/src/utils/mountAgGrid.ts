import { createGridStore, type PluginConfigAg } from "@jsoc/vanilla-grid-ag";
import { createGrid, type GridApi } from "ag-grid-community";
import { renderSimpleNavigator } from "@jsoc/vanilla-grid";
import type { GridData, GridStore } from "@jsoc/grid-core";

import type { ExampleMount } from "@jsoc/vanilla-grid-examples";

export function createAgGridMount(data: GridData): ExampleMount {
  return (root) => {
    root.replaceChildren();

    const navContainer = document.createElement("div");
    const gridContainer = document.createElement("div");
    gridContainer.style.height = "100%";
    root.append(navContainer, gridContainer);

    let gridApi: GridApi | undefined;
    const gridStore = createGridStore(data);

    function render(store: GridStore<PluginConfigAg>) {
      gridApi?.destroy();
      renderSimpleNavigator({ storeId: store.id }, navContainer);
      const activeSchema = store.getActiveSchema();
      gridApi = createGrid(gridContainer, activeSchema.config);
    }

    render(gridStore);
    const unsubscribe = gridStore.subscribe(() => {
      render(gridStore);
    });

    return () => {
      gridApi?.destroy();
      unsubscribe();
      root.replaceChildren();
    };
  };
}
