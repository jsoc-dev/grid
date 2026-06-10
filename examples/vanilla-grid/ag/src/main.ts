import "#index.css";
import basic from "#examples/Basic.ts";
import localData from "#examples/LocalData.ts";
import remoteData from "#examples/RemoteData.ts";

import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const root = document.getElementById("root")!;

mountExamplesRouter({
  root,
  pluginId: "ag",
  components: {
    basic,
    localData,
    remoteData,
  },
});
