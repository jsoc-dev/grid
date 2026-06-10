import { SimpleTable } from "../components/SimpleTable";

import classNames from "@jsoc/grid-examples-core/css/modules/remoteData.module.css";
import { RemoteDataExampleRenderer } from "@jsoc/react-grid-examples";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function RemoteDataExample() {
  return <RemoteDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classNames.layout}>
      <SimpleNavigator gridStore={gridStore} />
      <div className={classNames.gridContainer}>
        <SimpleTable table={table} />
      </div>
    </div>
  );
}
