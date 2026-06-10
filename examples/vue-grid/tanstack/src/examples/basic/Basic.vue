<script setup lang="ts">
import TanStackTable from "#components/TanStackTable.vue";
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-tanstack";
import { basicJSON } from "@jsoc/grid-examples-core";

const gridStore = useGridStore(basicJSON);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
</script>

<template>
  <TanStackTable :key="activeSchema.id" :config="activeSchema.config" />
</template>
