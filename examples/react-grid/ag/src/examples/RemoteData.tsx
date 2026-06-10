import { AgGridReact } from "#components/AgGridReact.tsx";

import classNames from "@jsoc/grid-examples-core/css/modules/remoteData.module.css";
import { RemoteDataExampleRenderer } from "@jsoc/react-grid-examples";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";

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
        <AgGridReact key={activeSchema.id} {...activeSchema.config} />
      </div>
    </div>
  );
}
