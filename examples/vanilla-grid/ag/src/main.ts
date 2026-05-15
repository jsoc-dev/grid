import "./index.css";

import {
  mountBasic,
  mountLocalData,
  mountRemoteData,
} from "./examples/index.ts";
import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const root = document.getElementById("root")!;

mountExamplesRouter({
  root,
  pluginId: "ag",
  examples: {
    basic: mountBasic,
    "local-data": mountLocalData,
    "remote-data": mountRemoteData,
  },
});
