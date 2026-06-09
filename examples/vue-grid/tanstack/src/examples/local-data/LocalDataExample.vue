<script setup lang="ts">
import TanStackTable from "#components/TanStackTable.vue";
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-tanstack";
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
  <TanStackTable
    :key="gridStore.id + activeSchema.id"
    :config="activeSchema.config"
  />
</template>
