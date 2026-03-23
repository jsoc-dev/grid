import type { PluginRenderer } from "@/playground/react-polygrid/_components/output/plugin-renderers/renderersByPlugin";

import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";

ModuleRegistry.registerModules([AllCommunityModule]);

export const PluginRendererAg: PluginRenderer["ag"] = ({ schema }) => {
  const { resolvedTheme } = useTheme();
  const generatedConfig = schema.config
  return (
    <AgGridReact
      {...generatedConfig}
      theme={
        resolvedTheme === "dark"
          ? themeQuartz.withPart(colorSchemeDark)
          : themeQuartz
      }
    />
  );
};

