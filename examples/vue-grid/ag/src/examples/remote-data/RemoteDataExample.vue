<script setup lang="ts">
import AgGridVue from "#components/AgGridVue.vue";

import classNames from "@jsoc/grid-examples-core/css/modules/remoteData.module.css";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/vue-grid";
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
  <div :class="classNames.layout">
    <SimpleNavigator :grid-store="gridStore" />

    <div :class="classNames.gridContainer">
      <!-- remount when store or schema changes because ag-grid-vue doesn't fully apply new grid-options without remounting. -->
      <AgGridVue
        :key="gridStore.id + activeSchema.id"
        :grid-options="activeSchema.config"
      />
    </div>
  </div>
</template>
