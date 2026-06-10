import type { ReactGridExampleIds, ReactGridPluginId } from "@jsoc/grid-docs";
import type { FC } from "react";

export type ExamplesRouterOptions<P extends ReactGridPluginId> = {
  pluginId: P;
  components: {
    [EId in ReactGridExampleIds<P>]: FC;
  };
};
