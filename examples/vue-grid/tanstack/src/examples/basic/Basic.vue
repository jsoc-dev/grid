<script setup lang="ts">
import TanStackTable from "#/components/TanStackTable.vue";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-tanstack";
import { basicJSON } from "@jsoc/grid-examples-shared";

const gridStore = useGridStore(basicJSON);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
</script>

<template>
  <GridStoreProvider :value="gridStore">
    <TanStackTable :key="activeSchema.id" :config="activeSchema.config" />
  </GridStoreProvider>
</template>
