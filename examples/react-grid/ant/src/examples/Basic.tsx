import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ant";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { Table } from "antd";

export function Basic() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return (
    <GridStoreProvider value={gridStore}>
      <Table key={activeSchema.id} {...activeSchema.config} />
    </GridStoreProvider>
  );
}
