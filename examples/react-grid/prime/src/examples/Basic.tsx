import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
import { shoeJSON } from "@jsoc/grid-examples-shared";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function Basic() {
  const gridStore = useGridStore(shoeJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  const { columns, ...config } = activeSchema.config;

  return (
    <GridStoreProvider value={gridStore}>
      <DataTable key={activeSchema.id} {...config}>
        {columns.map((col) => (
          <Column key={col.field} {...col} />
        ))}
      </DataTable>
    </GridStoreProvider>
  );
}
