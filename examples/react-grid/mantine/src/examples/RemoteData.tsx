import classNames from "@jsoc/grid-examples-shared/css/modules/remoteData.module.css";
import { RemoteDataExampleRenderer } from "@jsoc/react-grid-examples";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function RemoteDataExample() {
  return <RemoteDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  const table = useMantineReactTable(activeSchema.config);

  return (
    <div className={classNames.layout}>
      <SimpleNavigator gridStore={gridStore} />
      <div className={classNames.gridContainer}>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
}
