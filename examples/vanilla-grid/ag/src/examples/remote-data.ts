import { createAgGrid } from "#/utils/createAgGrid.ts";
import { createGridStore, type GridStoreAg } from "@jsoc/vanilla-grid-ag";
import {
  subscribeRemoteJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";
import type { GridApi } from "ag-grid-community";

export const renderRemoteDataExample: ExampleRenderer = (root) => {
  let gridApi: GridApi | undefined;
  let gridStore: GridStoreAg | undefined;

  const unsubscribeRemoteJSON = subscribeRemoteJSON((state) => {
    if (state.status === "loading") {
      renderLoading(root);
      return;
    }

    if (state.status === "error") {
      renderError(root, state.error);
      return;
    }

    gridStore?.destroy();
    gridStore = createGridStore({
      data: state.data,

      listener: ({ gridStore }) => {
        const gridOptions = gridStore.getActiveSchema().config;

        // we empty the container manually as AG Grid appends the grid to the provided container instead of replacing it.
        root.replaceChildren();

        // whenever the `gridStore` state changes, the `activeSchema.config` will be different than the previous one.
        // But AG Grid doesn't allow some grid options (Initial options) to be updated after initialisation, see
        // https://www.ag-grid.com/vue-data-grid/grid-interface/#initial-grid-options for more details.
        // So, instead of using gridApi.updateGridOptions(), we need to destroy the previous grid and re-create it.
        gridApi?.destroy();
        gridApi = createAgGrid(root, gridOptions);
      },
    });
  });

  return () => {
    gridApi?.destroy();
    gridStore?.destroy();
    unsubscribeRemoteJSON();
  };
};

function renderLoading(container: HTMLElement) {
  const message = document.createElement("p");
  message.textContent = "Loading...";
  container.replaceChildren(message);
}

function renderError(container: HTMLElement, error: Error) {
  const message = document.createElement("p");
  message.textContent = `Error: ${error.message}`;
  container.replaceChildren(message);
}
