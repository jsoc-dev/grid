import { Navigator } from "#ui/components/preview/Navigator.tsx";
import { Table } from "#ui/components/preview/Table.tsx";
import { customColumnGenerator } from "#ui/utils/columns.tsx";
import type { JSONFile } from "#shared/types.ts";

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
      <Navigator gridStore={gridStore} fileName={file.fileName} />
      <Table table={table} />
    </div>
  );
}
