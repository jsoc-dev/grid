import { SimpleTable } from "../components/SimpleTable";
import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
// </snippet>
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });
  // </snippet>

  return (
    // <snippet render>
    <SimpleTable table={table} />
    // </snippet>
  );
}
