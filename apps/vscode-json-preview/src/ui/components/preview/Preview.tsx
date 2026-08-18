import { Navigator } from "#ui/components/preview/Navigator.tsx";
import { Table } from "#ui/components/preview/Table.tsx";
import { ZoomControls } from "#ui/components/preview/ZoomControls.tsx";
import { useZoom } from "#ui/hooks/useZoom.ts";
import { customColumnGenerator } from "#ui/utils/columns.tsx";
import type { JSONFile } from "#shared/host-message.ts";

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
  const zoom = useZoom();
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
        <ZoomControls zoom={zoom} />
      </div>
      <div className="preview-content" style={{ zoom: zoom.level }}>
        <Table table={table} />
      </div>
    </div>
  );
}
