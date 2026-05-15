import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SimpleTable } from "../components/SimpleTable";

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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <GridStoreProvider value={gridStore}>
      <SimpleTable table={table} />
    </GridStoreProvider>
  );
}
