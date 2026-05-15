<script setup lang="ts">
import AgGridVue from "../components/AgGridVue.vue";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-ag";
import { shoeJSON } from "@jsoc/grid-examples-shared";

const gridStore = useGridStore(shoeJSON);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
</script>

<template>
  <GridStoreProvider :value="gridStore">
    <div class="example-grid">
      <AgGridVue :key="activeSchema.id" v-bind="activeSchema.config" />
    </div>
  </GridStoreProvider>
</template>
