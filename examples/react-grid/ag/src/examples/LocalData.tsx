import {AgGridReact} from "../components/AgGridReact";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";

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
        <AgGridReact key={activeSchema.id} {...activeSchema.config} />
      </div>
    </GridStoreProvider>
  );
}
