import { SimpleTable } from "../components/SimpleTable";
import { useGetRemoteJSON } from "@jsoc/react-grid-examples";
import {
  GridStoreProvider,
  SimpleNavigator,
  useGridStoreSelector,
} from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function RemoteData() {
  const { data, loading, error } = useGetRemoteJSON();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;

  return <Example data={data} />;
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
      <SimpleNavigator />
      <SimpleTable table={table} />
    </GridStoreProvider>
  );
}
