import "#/index.css";
import {
  renderBasicExample,
  renderLocalDataExample,
  renderRemoteDataExample,
} from "#/examples/index.ts";

import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

const root = document.getElementById("root")!;

mountExamplesRouter({
  root,
  pluginId: "tanstack",
  renderers: {
    basic: renderBasicExample,
    "local-data": renderLocalDataExample,
    "remote-data": renderRemoteDataExample,
  },
});
