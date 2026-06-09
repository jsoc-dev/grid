import { AgGridReact } from "#components/AgGridReact.tsx";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";

export default function BasicExample() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return <AgGridReact key={activeSchema.id} {...activeSchema.config} />;
}
