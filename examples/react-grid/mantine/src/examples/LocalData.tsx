import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { LocalDataExampleRenderer } from "@jsoc/react-grid-examples";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function LocalDataExample() {
  return <LocalDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  const table = useMantineReactTable(activeSchema.config);

  return <MantineReactTable table={table} />;
}
