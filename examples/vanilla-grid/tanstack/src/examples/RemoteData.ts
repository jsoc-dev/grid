import { createSimpleTable } from "#utils/createSimpleTable.ts";
import { useTable } from "#utils/useTable.ts";

import classNames from "@jsoc/grid-examples-shared/css/modules/remoteData.module.css";
import { createSimpleNavigator } from "@jsoc/vanilla-grid";
import {
  createGridStore,
  type GridStoreTanstack,
} from "@jsoc/vanilla-grid-tanstack";
import {
  mountRemoteDataExample,
  onUnmounted,
} from "@jsoc/vanilla-grid-examples";
import { getCoreRowModel } from "@tanstack/table-core";

export default function (root: HTMLElement) {
  let gridStore: GridStoreTanstack | undefined;

  const unsubscribe = mountRemoteDataExample(root, (data) => {
    const layout = document.createElement("div");
    layout.className = classNames.layout;

    const gridContainer = document.createElement("div");
    gridContainer.className = classNames.gridContainer;

    root.replaceChildren(layout);

    gridStore?.destroy();
    gridStore = createGridStore({
      data,
      listener: ({ gridStore }) => {
        const navigator = createSimpleNavigator(gridStore);
        const table = useTable({
          ...gridStore.getActiveSchema().config,
          getCoreRowModel: getCoreRowModel(),
        });

        const tableElement = createSimpleTable(table);
        gridContainer.replaceChildren(tableElement);
        layout.replaceChildren(navigator, gridContainer);
      },
    });
  });

  onUnmounted(() => {
    gridStore?.destroy();
    unsubscribe();
  });
}
