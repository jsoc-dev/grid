import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { createGridStore } from "@jsoc/vanilla-grid-ag";
import { createGrid } from "ag-grid-community";
// </snippet>
import { onUnmounted } from "@jsoc/vanilla-grid-examples";

export default function (root: HTMLElement) {
  // <snippet create>
  const gridStore = createGridStore({ data });
  const gridOptions = gridStore.getActiveSchema().config;
  // </snippet>
  // <snippet render>
  const gridApi = createGrid(root, gridOptions);
  // </snippet>

  onUnmounted(() => {
    gridApi.destroy();
    gridStore.destroy();
  });
}
