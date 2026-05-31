<script setup lang="ts">
import LocalDataExample from "#/examples/local-data/LocalDataExample.vue";
import { ErrorBoundary, useGetLocalJSON } from "@jsoc/vue-grid-examples";

const data = useGetLocalJSON();
</script>

<template>
  <p v-if="data === undefined">No data</p>
  <ErrorBoundary v-else :reset-keys="[data]">
    <LocalDataExample :data="data" />
  </ErrorBoundary>
</template>
