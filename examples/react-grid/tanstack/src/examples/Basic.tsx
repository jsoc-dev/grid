import { GridStoreProvider, useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { basicJSON } from "@jsoc/grid-examples-shared";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SimpleTable } from "../components/SimpleTable";

export function Basic() {
  const gridStore = useGridStore(basicJSON);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <GridStoreProvider value={gridStore}>
      <SimpleTable table={table} />
    </GridStoreProvider>
  );
}
