import { createAgGrid } from "#/utils/createAgGrid.ts";

import { basicJSON } from "@jsoc/grid-examples-shared";
import { createGridStore } from "@jsoc/vanilla-grid-ag";
import type { ExampleRenderer } from "@jsoc/vanilla-grid-examples";

export const renderBasicExample: ExampleRenderer = (root) => {
  const gridStore = createGridStore({ data: basicJSON });
  const gridOptions = gridStore.getActiveSchema().config;
  const gridApi = createAgGrid(root, gridOptions);

  return () => {
    gridApi.destroy();
    gridStore.destroy();
  };
};
