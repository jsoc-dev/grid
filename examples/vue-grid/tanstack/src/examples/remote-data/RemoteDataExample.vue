<script setup lang="ts">
import TanStackTable from "#components/TanStackTable.vue";

import classNames from "@jsoc/grid-examples-core/css/modules/remoteData.module.css";
import { SimpleNavigator, useGridStoreSelector } from "@jsoc/vue-grid";
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
  <div :class="classNames.layout">
    <SimpleNavigator :grid-store="gridStore" />

    <div :class="classNames.gridContainer">
      <TanStackTable
        :key="gridStore.id + activeSchema.id"
        :config="activeSchema.config"
      />
    </div>
  </div>
</template>
