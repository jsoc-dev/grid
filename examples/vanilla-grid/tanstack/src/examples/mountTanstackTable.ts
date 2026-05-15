import type { GridData, GridRow, GridStore } from "@jsoc/grid-core";
import { renderSimpleNavigator } from "@jsoc/vanilla-grid";
import {
  createGridStore,
  type PluginConfigTanstack,
} from "@jsoc/vanilla-grid-tanstack";
import { getCoreRowModel } from "@tanstack/table-core";

import type { ExampleMount } from "@jsoc/vanilla-grid-examples";

import { renderTable } from "../utils/renderTable.ts";
import { useTable } from "../utils/useTable.ts";

export function createTanstackTableMount(data: GridData): ExampleMount {
  return (root) => {
    root.replaceChildren();

    const navContainer = document.createElement("div");
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container";
    root.append(navContainer, tableContainer);

    const gridStore = createGridStore(data);

    function render(store: GridStore<PluginConfigTanstack>) {
      renderSimpleNavigator({ storeId: store.id }, navContainer);
      const activeSchema = store.getActiveSchema();
      const table = useTable<GridRow>({
        ...activeSchema.config,
        getCoreRowModel: getCoreRowModel(),
      });
      renderTable(table, tableContainer);
    }

    render(gridStore);
    const unsubscribe = gridStore.subscribe(() => {
      render(gridStore);
    });

    return () => {
      unsubscribe();
      root.replaceChildren();
    };
  };
}
