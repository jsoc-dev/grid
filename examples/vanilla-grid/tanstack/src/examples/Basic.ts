import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { createGridStore } from "@jsoc/vanilla-grid-tanstack";
import { getCoreRowModel } from "@tanstack/table-core";
import { useTable } from "#utils/useTable.ts";
import { renderTanstackTable } from "#utils/renderTanstackTable.ts";
// </snippet>
import { onUnmounted } from "@jsoc/vanilla-grid-examples";

export default function (root: HTMLElement) {
  // <snippet create>
  const gridStore = createGridStore({ data });
  const tableOptions = gridStore.getActiveSchema().config;
  const table = useTable({
    ...tableOptions,
    getCoreRowModel: getCoreRowModel(),
  });
  // </snippet>

  // <snippet render>
  const tableElement = renderTanstackTable(table);
  root.replaceChildren(tableElement);
  // </snippet>

  onUnmounted(() => {
    gridStore.destroy();
  });
}
