import { SubGridToggle } from "#components/SubGridToggle.tsx";
import type { ColumnGenerator } from "@jsoc/grid-core";
import {
  arrayOfObjectsColumnGeneratorAg,
  type PluginConfigAg,
} from "@jsoc/react-grid";
import type { ICellRendererParams } from "ag-grid-community";

export const customArrayOfObjectsColumnGeneratorAg: ColumnGenerator<
  PluginConfigAg
> = (params) => {
  const { gridSchema, columnKey } = params;
  return arrayOfObjectsColumnGeneratorAg(params, {
    cellRenderer: (params: ICellRendererParams) => {
      const { data, value } = params;

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: data[gridSchema.meta.primaryColumnKey],
            columnKey,
          }}
        />
      );
    },
  });
};
