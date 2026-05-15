<script setup lang="ts">
import { Basic, LocalData, RemoteData } from "./examples";
import { ExamplesRouter } from "@jsoc/vue-grid-examples";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
</script>

<template>
  <div class="example-root example-view">
    <ExamplesRouter
      plugin-id="ag"
      :components="{
        basic: Basic,
        'local-data': LocalData,
        'remote-data': RemoteData,
      }"
    />
  </div>
</template>
