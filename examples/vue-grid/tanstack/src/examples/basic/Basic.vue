<script setup lang="ts">
import TanStackTable from "#components/TanStackTable.vue";
import { basicJSON } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-tanstack";
// </snippet>

// <snippet create>
const gridStore = useGridStore(basicJSON);
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
