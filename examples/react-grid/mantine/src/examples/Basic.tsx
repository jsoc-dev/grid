import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function BasicExample() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  const table = useMantineReactTable(activeSchema.config);

  return <MantineReactTable table={table} />;
}
