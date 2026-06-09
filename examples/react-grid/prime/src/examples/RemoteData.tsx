import classNames from "@jsoc/grid-examples-shared/css/modules/remoteData.module.css";
import { RemoteDataExampleRenderer } from "@jsoc/react-grid-examples";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-prime";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function RemoteDataExample() {
  return <RemoteDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  const { columns, ...config } = activeSchema.config;

  return (
    <div className={classNames.layout}>
      <SimpleNavigator gridStore={gridStore} />
      <div className={classNames.gridContainer}>
        <DataTable key={activeSchema.id} {...config}>
          {columns.map((col) => (
            <Column key={col.field} {...col} />
          ))}
        </DataTable>
      </div>
    </div>
  );
}
