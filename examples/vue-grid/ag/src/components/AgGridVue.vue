<script setup lang="ts">
import { useDetectColorScheme } from "@jsoc/vue-grid-examples";
import type { GridRow } from "@jsoc/grid-core";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import type { GridOptions } from "ag-grid-community";
import { AgGridVue as AgGrid } from "ag-grid-vue3";
import { computed } from "vue";

const themes = {
  light: themeQuartz,
  dark: themeQuartz.withPart(colorSchemeDark),
};

defineProps<{
  gridOptions: GridOptions<GridRow>;
}>();

const theme = useTheme();

/**
 * `AgGridVue` with automatic Quartz light/dark theme based on the system preference.
 * @see {@link https://www.ag-grid.com/vue-data-grid/getting-started/ Vue AG Grid}
 */
function useTheme() {
  const colorScheme = useDetectColorScheme();
  return computed(() => themes[colorScheme.value]);
}
</script>

<template>
  <AgGrid
    :grid-options="gridOptions"
    :theme="theme"
    style="height: 100%; width: 100%"
  />
</template>
