import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { DataGrid } from "@mui/x-data-grid";

export function Basic() {
  const gridStore = useGridStore(basicJSON);
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
