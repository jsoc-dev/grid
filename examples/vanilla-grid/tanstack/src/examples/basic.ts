import { useTable } from "#/utils/useTable.ts";
import { renderTable } from "#/utils/renderTable.ts";

import { basicJSON } from "@jsoc/grid-examples-shared";
import { createGridStore } from "@jsoc/vanilla-grid-tanstack";
import type { ExampleRenderer } from "@jsoc/vanilla-grid-examples";
import { getCoreRowModel } from "@tanstack/table-core";

export const renderBasicExample: ExampleRenderer = (root) => {
  const gridStore = createGridStore({ data: basicJSON });
  const tableOptions = gridStore.getActiveSchema().config;
  const table = useTable({
    ...tableOptions,
    getCoreRowModel: getCoreRowModel(),
  });

  renderTable(table, root);

  return () => {
    gridStore.destroy();
  };
};
