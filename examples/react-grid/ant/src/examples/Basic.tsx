import { AntTable } from "#components/AntTable.tsx";
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ant";
import { basicJSON } from "@jsoc/grid-examples-shared";

export default function BasicExample() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  return <AntTable key={activeSchema.id} {...activeSchema.config} />;
}
