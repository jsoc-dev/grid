import { Navigator } from "#components/preview/Navigator.tsx";
import { Table } from "#components/preview/Table.tsx";
import type { JSONFile } from "#types.ts";
import { customColumnGenerator } from "#utils/columns.tsx";

import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-tanstack";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

type PreviewProps = {
  file: JSONFile;
};

const customColumnGeneratorOptions = {
  customColumnGeneratorByType: {
    ujsonObject: customColumnGenerator,
    ujsonObjectArray: customColumnGenerator,
  },
};

export function Preview({ file }: PreviewProps) {
  const gridStore = useGridStore(file.json, customColumnGeneratorOptions);
  const activeSchema = useGridStoreSelector(gridStore, (store) =>
    store.getActiveSchema(),
  );

  const table = useReactTable({
    ...activeSchema.config,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-2 p-4 pb-16 h-full">
      <div className="flex justify-between items-center gap-4">
        <Navigator gridStore={gridStore} fileName={file.fileName} />
      </div>
      <div className="flex-1 min-h-0">
        <Table table={table} />
      </div>
    </div>
  );
}
