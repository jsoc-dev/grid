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

export const renderLocalDataExample: ExampleRenderer = (root) => {
  let gridStore: GridStoreTanstack | undefined;

  const unsubscribeLocalJSON = subscribeLocalJSON((data) => {
    if (!data) {
      renderNoData(root);
      return;
    }

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
