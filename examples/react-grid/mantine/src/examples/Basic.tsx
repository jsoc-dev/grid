import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-mantine";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
// </snippet>

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );

  const table = useMantineReactTable(activeSchema.config);
  // </snippet>

  return (
    // <snippet render>
    <MantineReactTable table={table} />
    // </snippet>
  );
}
