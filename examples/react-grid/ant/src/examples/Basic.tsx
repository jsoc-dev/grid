import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ant";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { Table } from "antd";
import { TableWrapper } from "../components/TableWrapper";

export function Basic() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return (
    <GridStoreProvider value={gridStore}>
      <TableWrapper>
        <Table key={activeSchema.id} {...activeSchema.config} />
      </TableWrapper>
    </GridStoreProvider>
  );
}
