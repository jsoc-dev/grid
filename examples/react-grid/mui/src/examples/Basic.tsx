import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mui";
// </snippet>
import { DataGrid } from "@mui/x-data-grid";

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  // </snippet>

  return (
    // <snippet render>
    <DataGrid key={activeSchema.id} {...activeSchema.config} />
    // </snippet>
  );
}
