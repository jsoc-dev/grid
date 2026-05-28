import "#/index.css";
import {
  renderBasicExample,
  renderLocalDataExample,
  renderRemoteDataExample,
} from "#/examples/index.ts";

import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const root = document.getElementById("root")!;

mountExamplesRouter({
  root,
  pluginId: "ag",
  renderers: {
    basic: renderBasicExample,
    "local-data": renderLocalDataExample,
    "remote-data": renderRemoteDataExample,
  },
});
