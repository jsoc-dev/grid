import { createAgGrid } from "#utils/createAgGrid.ts";

import { createGridStore, type GridStoreAg } from "@jsoc/vanilla-grid-ag";
import {
  mountLocalDataExample,
  onUnmounted,
} from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export default function (root: HTMLElement) {
  let gridApi: GridApi | undefined;
  let gridStore: GridStoreAg | undefined;

  const unsubscribe = mountLocalDataExample(root, (data) => {
    gridStore?.destroy();
    gridStore = createGridStore({
      data,
      listener: ({ gridStore }) => {
        root.replaceChildren();
        const gridOptions = gridStore.getActiveSchema().config;
        gridApi?.destroy();
        gridApi = createAgGrid(root, gridOptions);
      },
    });
  });

  onUnmounted(() => {
    gridApi?.destroy();
    gridStore?.destroy();
    unsubscribe();
  });
}
