<script setup lang="ts">
import AgGridVue from "#/components/AgGridVue.vue";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-ag";
import { toRef } from "vue";

const props = defineProps<{
  data: string;
}>();

const dataRef = toRef(props, "data");
const gridStore = useGridStore(dataRef);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
</script>

<template>
  <GridStoreProvider :value="gridStore">
    <AgGridVue
      :key="gridStore.id + activeSchema.id"
      :grid-options="activeSchema.config"
    />
  </GridStoreProvider>
</template>
