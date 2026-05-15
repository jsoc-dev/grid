import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function LocalData() {
  const data = useGetLocalJSON();

  if (!data) return <p>No data</p>;

  return (
    <ErrorBoundary resetKeys={[data]}>
      <Example data={data} />
    </ErrorBoundary>
  );
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
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
