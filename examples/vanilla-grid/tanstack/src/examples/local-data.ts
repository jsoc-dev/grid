import { useTable } from "#/utils/useTable.ts";
import { renderTable } from "#/utils/renderTable.ts";

import {
  createGridStore,
  type GridStoreTanstack,
} from "@jsoc/vanilla-grid-tanstack";
import {
  subscribeLocalJSON,
  type ExampleRenderer,
} from "@jsoc/vanilla-grid-examples";
import { getCoreRowModel } from "@tanstack/table-core";
import { ensureError } from "@jsoc/utils";

export const renderLocalDataExample: ExampleRenderer = (root) => {
  let gridStore: GridStoreTanstack | undefined;

  const unsubscribeLocalJSON = subscribeLocalJSON((data) => {
    if (!data) {
      renderNoData(root);
      return;
    }

    try {
      gridStore?.destroy();
      gridStore = createGridStore({
        data,
        listener: ({ gridStore }) => {
          const tableOptions = gridStore.getActiveSchema().config;
          const table = useTable({
            ...tableOptions,
            getCoreRowModel: getCoreRowModel(),
          });

          renderTable(table, root);
        },
      });
    } catch (error) {
      renderError(root, error);
    }
  });

  return () => {
    gridStore?.destroy();
    unsubscribeLocalJSON();
  };
};

function renderNoData(container: HTMLElement) {
  const message = document.createElement("p");
  message.textContent = "No data";
  container.replaceChildren(message);
}

function renderError(container: HTMLElement, error: unknown) {
  const err = ensureError(error);
  const message = document.createElement("p");
  message.textContent = `Error: ${err.message}`;
  container.replaceChildren(message);
}
