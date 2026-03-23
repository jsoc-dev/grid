import { PluginRendererAg } from "@/playground/react-polygrid/_components/output/plugin-renderers/PluginRendererAg";
import { PluginRendererMantine } from "@/playground/react-polygrid/_components/output/plugin-renderers/PluginRendererMantine";
import { PluginRendererMui } from "@/playground/react-polygrid/_components/output/plugin-renderers/PluginRendererMui";
import type { NonHeadlessPlugins } from "@/playground/react-polygrid/Playground";

import type { GridSchemaWithConfig } from "@jsoc/grid-core";
import type { ConfigByPlugin } from "@jsoc/react-grid";

export type PluginRenderer = {
  [P in NonHeadlessPlugins]: React.ComponentType<{
    schema: GridSchemaWithConfig<ConfigByPlugin[P]>;
  }>;
};

export const RenderersByPlugin: PluginRenderer = {
  ag: PluginRendererAg,
  mui: PluginRendererMui,
  mantine: PluginRendererMantine,
};