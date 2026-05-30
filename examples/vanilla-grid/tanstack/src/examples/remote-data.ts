import { useTable } from "#/utils/useTable.ts";
import { renderTable } from "#/utils/renderTable.ts";

import {
  createGridStore,
  type GridStoreTanstack,
} from "@jsoc/vanilla-grid-tanstack";
import {
  renderError,
  subscribeRemoteJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";
import { getCoreRowModel } from "@tanstack/table-core";

export const renderRemoteDataExample: ExampleRenderer = (root) => {
  let gridStore: GridStoreTanstack | undefined;

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
        const tableOptions = gridStore.getActiveSchema().config;
        const table = useTable({
          ...tableOptions,
          getCoreRowModel: getCoreRowModel(),
        });

        renderTable(table, root);
      },
    });
  });

  return () => {
    gridStore?.destroy();
    unsubscribeRemoteJSON();
  };
};

function renderLoading(container: HTMLElement) {
  const message = document.createElement("p");
  message.textContent = "Loading...";
  container.replaceChildren(message);
}
