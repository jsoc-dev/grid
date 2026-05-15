import { useGetRemoteJSON } from "@jsoc/react-grid-examples";
import {
  GridStoreProvider,
  SimpleNavigator,
  useGridStoreSelector,
} from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

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

  const table = useMantineReactTable(activeSchema.config);

  return (
    <GridStoreProvider value={gridStore}>
      <SimpleNavigator />
      <MantineReactTable table={table} />
    </GridStoreProvider>
  );
}
