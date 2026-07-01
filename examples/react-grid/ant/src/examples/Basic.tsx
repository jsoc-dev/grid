import { Table } from "antd";
import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ant";
// </snippet>

export default function BasicExample() {
  // <snippet create>
  const gridStore = useGridStore(data);
  const activeSchema = useGridStoreSelector(gridStore, (gridStore) =>
    gridStore.getActiveSchema(),
  );
  // </snippet>

  return (
    // <snippet render>
    <Table key={activeSchema.id} {...activeSchema.config} />
    // </snippet>
  );
}
