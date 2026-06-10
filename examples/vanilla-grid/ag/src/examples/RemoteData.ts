import { createAgGrid } from "#utils/createAgGrid.ts";

import classNames from "@jsoc/grid-examples-core/css/modules/remoteData.module.css";
import { createSimpleNavigator } from "@jsoc/vanilla-grid";
import { createGridStore, type GridStoreAg } from "@jsoc/vanilla-grid-ag";
import {
  mountRemoteDataExample,
  onUnmounted,
} from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export default function (root: HTMLElement) {
  let gridApi: GridApi | undefined;
  let gridStore: GridStoreAg | undefined;

  const unsubscribe = mountRemoteDataExample(root, (data) => {
    const layout = document.createElement("div");
    layout.className = classNames.layout;

    const gridContainer = document.createElement("div");
    gridContainer.className = classNames.gridContainer;

    root.replaceChildren(layout);

    gridStore?.destroy();
    gridStore = createGridStore({
      data,
      listener: ({ gridStore }) => {
        const navigator = createSimpleNavigator(gridStore);
        const gridOptions = gridStore.getActiveSchema().config;
        // whenever the `gridStore` state changes, the `gridOptions` will be different than the previous one.
        // But AG Grid doesn't allow some grid options (Initial options) to be updated after initialisation, see
        // https://www.ag-grid.com/vue-data-grid/grid-interface/#initial-grid-options for more details.
        // So, instead of using gridApi.updateGridOptions(), we need to destroy the previous grid and re-create it.
        gridApi?.destroy();
        gridApi = createAgGrid(gridContainer, gridOptions);
        layout.replaceChildren(navigator, gridContainer);
      },
    });
  });

  onUnmounted(() => {
    gridApi?.destroy();
    gridStore?.destroy();
    unsubscribe();
  });
}
