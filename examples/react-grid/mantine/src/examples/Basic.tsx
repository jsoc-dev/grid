import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { shoeJSON } from "@jsoc/grid-examples-shared";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export function Basic() {
  const gridStore = useGridStore(shoeJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  const table = useMantineReactTable(activeSchema.config);

  return (
    <GridStoreProvider value={gridStore}>
      <MantineReactTable table={table} />
    </GridStoreProvider>
  );
}
