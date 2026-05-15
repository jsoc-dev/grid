import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";
import { DataGrid } from "@mui/x-data-grid";

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

  return (
    <GridStoreProvider value={gridStore}>
      <div style={{ height: "100%" }}>
        <DataGrid key={activeSchema.id} {...activeSchema.config} />
      </div>
    </GridStoreProvider>
  );
}
