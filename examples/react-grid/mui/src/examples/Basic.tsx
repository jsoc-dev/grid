import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { DataGrid } from "@mui/x-data-grid";

export default function BasicExample() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return <DataGrid key={activeSchema.id} {...activeSchema.config} />;
}
