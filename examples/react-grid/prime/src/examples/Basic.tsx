import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
import { basicJSON } from "@jsoc/grid-examples-core";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function BasicExample() {
  const gridStore = useGridStore(basicJSON);
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
