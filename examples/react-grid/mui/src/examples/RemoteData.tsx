import classNames from "@jsoc/grid-examples-shared/css/modules/remoteData.module.css";
import { RemoteDataExampleRenderer } from "@jsoc/react-grid-examples";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
import { DataGrid } from "@mui/x-data-grid";

export default function RemoteDataExample() {
  return <RemoteDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return (
    <div className={classNames.layout}>
      <SimpleNavigator gridStore={gridStore} />
      <div className={classNames.gridContainer}>
        <DataGrid key={activeSchema.id} {...activeSchema.config} />
      </div>
    </div>
  );
}
