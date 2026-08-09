import { Navigator } from "#ui/components/preview/Navigator.tsx";
import { Table } from "#ui/components/preview/Table.tsx";
import type { JSONFile } from "#shared/types.ts";

import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

type PreviewProps = {
  file: JSONFile;
};

export function Preview({ file }: PreviewProps) {
  const gridStore = useGridStore(file.json);
  const activeSchema = useGridStoreSelector(gridStore, (store) =>
    store.getActiveSchema(),
  );

  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="preview">
      <Navigator gridStore={gridStore} fileName={file.fileName} />
      <Table table={table} />
    </div>
  );
}
