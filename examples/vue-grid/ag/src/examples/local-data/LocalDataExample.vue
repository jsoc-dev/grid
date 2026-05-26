<script setup lang="ts">
import AgGridVue from "#/components/AgGridVue.vue";
import { GridStoreProvider, useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-ag";

const props = defineProps<{
  data: string;
}>();

const gridStore = useGridStore(props.data);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
</script>

<template>
  <GridStoreProvider :value="gridStore">
    <AgGridVue :key="activeSchema.id" :grid-options="activeSchema.config" />
  </GridStoreProvider>
</template>
