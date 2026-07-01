import { createAgGrid } from "#utils/createAgGrid.ts";

import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { createGridStore } from "@jsoc/vanilla-grid-ag";
// </snippet>
import { onUnmounted } from "@jsoc/vanilla-grid-examples";

export default function (root: HTMLElement) {
  // <snippet create>
  const gridStore = createGridStore({ data });
  const gridOptions = gridStore.getActiveSchema().config;
  // </snippet>
  // <snippet render>
  const gridApi = createAgGrid(root, gridOptions);
  // </snippet>

  onUnmounted(() => {
    gridApi.destroy();
    gridStore.destroy();
  });
}
