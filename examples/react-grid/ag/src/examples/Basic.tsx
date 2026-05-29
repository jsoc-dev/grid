import { AgGridReact } from "../components/AgGridReact";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
import { basicJSON } from "@jsoc/grid-examples-shared";

export function Basic() {
  const gridStore = useGridStore(basicJSON);
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
