<script setup lang="ts">
import { useDetectColorScheme } from "@jsoc/vue-grid-examples";

import type { GridRow } from "@jsoc/grid-core";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import type { GridOptions } from "ag-grid-community";
import { AgGridVue as AgGrid } from "ag-grid-vue3";
import { computed } from "vue";

const props = defineProps<{
  gridOptions: GridOptions<GridRow>;
}>();

const colorScheme = useDetectColorScheme();
const theme = computed(() =>
  colorScheme.value === "dark"
    ? themeQuartz.withPart(colorSchemeDark)
    : themeQuartz,
);

const gridOptions = computed(() => props.gridOptions);
</script>

<template>
  <AgGrid
    :grid-options="gridOptions"
    :theme="theme"
    style="height: 100%; width: 100%"
  />
</template>
