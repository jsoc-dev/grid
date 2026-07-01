import { renderTanstackTable } from "#utils/renderTanstackTable.ts";
import { useTable } from "#utils/useTable.ts";

import {
  createGridStore,
  type GridStoreTanstack,
} from "@jsoc/vanilla-grid-tanstack";
import {
  mountLocalDataExample,
  onUnmounted,
} from "@jsoc/vanilla-grid-examples";
import { getCoreRowModel } from "@tanstack/table-core";

export default function (root: HTMLElement) {
  let gridStore: GridStoreTanstack | undefined;

  const unsubscribe = mountLocalDataExample(root, (data) => {
    gridStore?.destroy();
    gridStore = createGridStore({
      data,
      listener: ({ gridStore }) => {
        root.replaceChildren();
        const tableOptions = gridStore.getActiveSchema().config;
        const table = useTable({
          ...tableOptions,
          getCoreRowModel: getCoreRowModel(),
        });

        const tableElement = renderTanstackTable(table);
        root.replaceChildren(tableElement);
      },
    });
  });

  onUnmounted(() => {
    gridStore?.destroy();
    unsubscribe();
  });
}
