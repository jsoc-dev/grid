import { SubGridToggle } from "#components/SubGridToggle.tsx";
import type { ColumnGenerator } from "@jsoc/grid-core";
import {
  arrayOfObjectsColumnGeneratorMui,
  type PluginConfigMui,
} from "@jsoc/react-grid";
import { GridRenderCellParams } from "@mui/x-data-grid";

export const customArrayOfObjectsColumnGeneratorMui: ColumnGenerator<
  PluginConfigMui
> = (params) => {
  const { gridSchema, columnKey } = params;
  return arrayOfObjectsColumnGeneratorMui(params, {
    renderCell: (params: GridRenderCellParams) => {
      const { row, value } = params;

      return (
        <SubGridToggle
          subGridData={value}
          parentGridId={gridSchema.options.id}
          parentGridCellLocation={{
            rowId: row[gridSchema.meta.primaryColumnKey],
            columnKey,
          }}
        />
      );
    },
  });
};
