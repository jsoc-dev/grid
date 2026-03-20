import { SubGridToggle } from "#components/SubGridToggle.tsx";
import type { PluginConfigGeneratorOptions } from "@jsoc/core/grid";
import {
  arrayOfObjectsColumnGeneratorAg,
  arrayOfObjectsColumnGeneratorMui,
  type ConfigByPlugin,
  type GridPlugin,
} from "@jsoc/react-grid";
import { GridRenderCellParams } from "@mui/x-data-grid";
import type { ICellRendererParams } from "ag-grid-community";

const defaultConfigGeneratorOptionsMui: PluginConfigGeneratorOptions<
  ConfigByPlugin["mui"]
> = {
  customColumnGeneratorByType: {
    arrayOfObjects: (params) => {
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
    },
  },
};

const defaultConfigGeneratorOptionsAg: PluginConfigGeneratorOptions<
  ConfigByPlugin["ag"]
> = {
  customColumnGeneratorByType: {
    arrayOfObjects: (params) => {
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
    },
  },
};

export const getConfigGeneratorOptions = <P extends GridPlugin>(
  plugin: P,
): PluginConfigGeneratorOptions<ConfigByPlugin[P]> => {
  let options: PluginConfigGeneratorOptions;
  switch (plugin) {
    case "mui":
      options = defaultConfigGeneratorOptionsMui;
    case "ag":
      options = defaultConfigGeneratorOptionsAg;
  }

  return options;
};
