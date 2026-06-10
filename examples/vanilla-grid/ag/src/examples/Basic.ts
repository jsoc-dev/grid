import { createAgGrid } from "#utils/createAgGrid.ts";

import { basicJSON } from "@jsoc/grid-examples-shared";
import { createGridStore } from "@jsoc/vanilla-grid-ag";
import { onUnmounted } from "@jsoc/vanilla-grid-examples";

export default function (root: HTMLElement) {
  const gridStore = createGridStore({ data: basicJSON });
  const gridOptions = gridStore.getActiveSchema().config;
  const gridApi = createAgGrid(root, gridOptions);

  onUnmounted(() => {
    gridApi.destroy();
    gridStore.destroy();
  });
}
