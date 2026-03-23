import type { PluginRenderer } from "@/playground/react-polygrid/_components/output/plugin-renderers/renderersByPlugin";

import { DataGrid } from "@mui/x-data-grid";


export const PluginRendererMui: PluginRenderer["mui"] = ({ schema }) => {
  return (
    <DataGrid
      {...schema.config}
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          fontFamily: `"Segoe UI", Arial, sans-serif`, // since this app doesnt have Roboto so Header font was falling back to Arial which doesnt look bold on 500 weight unlike Roboto, Segoe UI.
        },
        "& .MuiDataGrid-cell": {
          fontFamily: `"Segoe UI", "Helvetica Neue", Arial, sans-serif`, // for consistency with header font
        },
      }}
    />
  );
};
