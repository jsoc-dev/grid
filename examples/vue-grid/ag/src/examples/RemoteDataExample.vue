<script setup lang="ts">
import AgGridVue from "../components/AgGridVue.vue";
import { GridStoreProvider, SimpleNavigator, useGridStoreSelector } from "@jsoc/vue-grid";
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
    <SimpleNavigator />
    <div class="example-grid">
      <AgGridVue :key="activeSchema.id" v-bind="activeSchema.config" />
    </div>
  </GridStoreProvider>
</template>
