import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ant";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/react-grid-examples";
import { Table } from "antd";
import { TableWrapper } from "../components/TableWrapper";

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
      <TableWrapper>
        <Table key={activeSchema.id} {...activeSchema.config} />
      </TableWrapper>
    </GridStoreProvider>
  );
}
