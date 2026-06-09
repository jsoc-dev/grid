<script setup lang="ts">
import basic from "#examples/basic/Basic.vue";
import localData from "#examples/local-data/LocalData.vue";
import remoteData from "#examples/remote-data/RemoteData.vue";

import { ExamplesRouter } from "@jsoc/vue-grid-examples";
</script>

<template>
  <ExamplesRouter
    plugin-id="tanstack"
    :components="{ basic, localData, remoteData }"
  />
</template>
