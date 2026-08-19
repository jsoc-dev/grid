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
    <div className="preview">
      <div className="preview-header">
        <Navigator gridStore={gridStore} fileName={file.fileName} />
      </div>
      <div className="preview-content">
        <Table table={table} />
      </div>
    </div>
  );
}
