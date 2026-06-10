import type { VueGridExampleIds, VueGridPluginId } from "@jsoc/grid-docs";
import type { Component } from "vue";

export type ExamplesRouterOptions<P extends VueGridPluginId = VueGridPluginId> =
  {
    pluginId: P;
    components: {
      [EId in VueGridExampleIds<P>]: Component;
    };
  };
