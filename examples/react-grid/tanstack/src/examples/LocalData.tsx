import { TanstackTable } from "#components/TanstackTable.tsx";
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { LocalDataExampleRenderer } from "@jsoc/react-grid-examples";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function LocalDataExample() {
  return <LocalDataExampleRenderer component={Example} />;
}

function Example({ data }: { data: string }) {
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return <TanstackTable table={table} />;
}
