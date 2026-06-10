import { createSimpleTable } from "#utils/createSimpleTable.ts";
import { useTable } from "#utils/useTable.ts";

import { basicJSON } from "@jsoc/grid-examples-core";
import { createGridStore } from "@jsoc/vanilla-grid-tanstack";
import { getCoreRowModel } from "@tanstack/table-core";
import { onUnmounted } from "@jsoc/vanilla-grid-examples";

export default function (root: HTMLElement) {
  const gridStore = createGridStore({ data: basicJSON });
  const tableOptions = gridStore.getActiveSchema().config;
  const table = useTable({
    ...tableOptions,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableElement = createSimpleTable(table);
  root.replaceChildren(tableElement);

  onUnmounted(() => {
    gridStore.destroy();
  });
}
