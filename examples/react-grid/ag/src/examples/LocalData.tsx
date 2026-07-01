import { AgGridReact } from "ag-grid-react";

import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
import { LocalDataExampleRenderer } from "@jsoc/react-grid-examples";

export default function LocalDataExample() {
  return <LocalDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return <AgGridReact key={activeSchema.id} {...activeSchema.config} />;
}
