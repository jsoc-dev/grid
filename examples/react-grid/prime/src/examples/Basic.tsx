import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
// </snippet>
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  const { columns, ...config } = activeSchema.config;
  // </snippet>

  return (
    // <snippet render>
    <DataTable key={activeSchema.id} {...config}>
      {columns.map((col) => (
        <Column key={col.field} {...col} />
      ))}
    </DataTable>
    // </snippet>
  );
}
