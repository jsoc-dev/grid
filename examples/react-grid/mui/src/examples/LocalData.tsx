import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
import { LocalDataExampleRenderer } from "@jsoc/react-grid-examples";
import { DataGrid } from "@mui/x-data-grid";

export default function LocalDataExample() {
  return <LocalDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return <DataGrid key={activeSchema.id} {...activeSchema.config} />;
}
