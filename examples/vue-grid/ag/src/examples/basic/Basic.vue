<script setup lang="ts">
import { basicJSON as data } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-ag";
import { AgGridVue } from "ag-grid-vue3";
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
  <AgGridVue :key="activeSchema.id" :grid-options="activeSchema.config" />
  <!-- </snippet> -->
</template>
