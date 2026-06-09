import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
import { LocalDataExampleRenderer } from "@jsoc/react-grid-examples";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function LocalDataExample() {
  return <LocalDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  const { columns, ...config } = activeSchema.config;

  return (
    <DataTable key={activeSchema.id} {...config}>
      {columns.map((col) => (
        <Column key={col.field} {...col} />
      ))}
    </DataTable>
  );
}
