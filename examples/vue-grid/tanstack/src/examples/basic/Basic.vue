<script setup lang="ts">
import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-tanstack";
import TanStackTable from "#components/TanStackTable.vue";
// </snippet>

// <snippet create>
const gridStore = useGridStore(data);
const activeSchema = useGridStoreSelector(gridStore, (store) =>
  store.getActiveSchema(),
);
// </snippet>
</script>

<template>
  <!-- <snippet render> -->
  <TanStackTable :key="activeSchema.id" :config="activeSchema.config" />
  <!-- </snippet> -->
</template>
