<script setup lang="ts">
import { Basic, LocalData, RemoteData } from "#/examples/index.ts";
import { ExamplesRouter } from "@jsoc/vue-grid-examples";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
</script>

<template>
  <ExamplesRouter
    plugin-id="ag"
    :components="{
      basic: Basic,
      'local-data': LocalData,
      'remote-data': RemoteData,
    }"
  />
</template>
