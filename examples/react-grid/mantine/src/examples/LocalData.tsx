import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

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

  const table = useMantineReactTable(activeSchema.config);

  return (
    <GridStoreProvider value={gridStore}>
      <MantineReactTable table={table} />
    </GridStoreProvider>
  );
}
