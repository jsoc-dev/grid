<script setup lang="ts">
import AgGridVue from "#components/AgGridVue.vue";
import { basicJSON } from "@jsoc/grid-examples-core";
// <snippet import>
import { useGridStoreSelector } from "@jsoc/vue-grid";
import { useGridStore } from "@jsoc/vue-grid-ag";
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
  <AgGridVue :key="activeSchema.id" :grid-options="activeSchema.config" />
  <!-- </snippet> -->
</template>
