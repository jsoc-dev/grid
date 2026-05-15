import { AgGridReact } from "../components/AgGridReact";
import { useGetRemoteJSON } from "@jsoc/react-grid-examples";
import {
  GridStoreProvider,
  SimpleNavigator,
  useGridStoreSelector,
} from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";

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

  return (
    <GridStoreProvider value={gridStore}>
      <SimpleNavigator />
      <div style={{ height: "calc(100% - 40px)" }}>
        <AgGridReact key={activeSchema.id} {...activeSchema.config} />
      </div>
    </GridStoreProvider>
  );
}
