<script setup lang="ts">
import LocalDataExample from "#examples/local-data/LocalDataExample.vue";
import { createGridStore } from "@jsoc/vue-grid-ag";
import { LocalDataExampleRenderer } from "@jsoc/vue-grid-examples";

function render(data: string) {
  createGridStore(data);
}
</script>

<template>
  <LocalDataExampleRenderer :component="LocalDataExample" :render="render" />
</template>
