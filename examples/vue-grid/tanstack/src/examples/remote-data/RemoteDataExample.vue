<script setup lang="ts">
import TanStackTable from "#/components/TanStackTable.vue";
import {
  GridStoreProvider,
  SimpleNavigator,
  useGridStoreSelector,
} from "@jsoc/vue-grid";
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
  <GridStoreProvider :value="gridStore">
    <SimpleNavigator />

    <TanStackTable
      :key="gridStore.id + activeSchema.id"
      :config="activeSchema.config"
    />
  </GridStoreProvider>
</template>
