import { AgGridReact } from "#components/AgGridReact.tsx";
import { basicJSON } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
// </snippet>

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  // </snippet>

  return (
    // <snippet render>
    <AgGridReact key={activeSchema.id} {...activeSchema.config} />
    // </snippet>
  );
}
