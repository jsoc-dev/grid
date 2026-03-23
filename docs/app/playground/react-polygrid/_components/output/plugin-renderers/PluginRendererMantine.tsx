import type { PluginRenderer } from "@/playground/react-polygrid/_components/output/plugin-renderers/renderersByPlugin";

import { MantineReactTable } from "mantine-react-table";

export const PluginRendererMantine: PluginRenderer["mantine"] = ({ schema }) => {
  return (
    <MantineReactTable
      {...schema.config}
      mantineTableContainerProps={{
        style: {
          overflow: "auto",
        },
      }}
    />
  );
}

