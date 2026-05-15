import "./index.css";

import {
  mountBasic,
  mountLocalData,
  mountRemoteData,
} from "./examples/index.ts";
import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root element not found");
}

mountExamplesRouter({
  root,
  pluginId: "tanstack",
  examples: {
    basic: mountBasic,
    "local-data": mountLocalData,
    "remote-data": mountRemoteData,
  },
});
