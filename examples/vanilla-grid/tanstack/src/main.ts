import "#index.css";
import basic from "#examples/Basic.ts";
import localData from "#examples/LocalData.ts";
import remoteData from "#examples/RemoteData.ts";

import { mountExamplesRouter } from "@jsoc/vanilla-grid-examples";

const root = document.getElementById("root")!;

mountExamplesRouter({
  root,
  pluginId: "tanstack",
  components: {
    basic,
    localData,
    remoteData,
  },
});
