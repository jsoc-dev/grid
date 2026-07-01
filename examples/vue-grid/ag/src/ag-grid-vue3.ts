// re-export everything so that other imports don't break
export * from "ag-grid-vue3";

import { useDetectColorScheme } from "@jsoc/vue-grid-examples";
import type { GridRow } from "@jsoc/grid-core";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import type { GridOptions } from "ag-grid-community";
import { AgGridVue as AgGrid } from "ag-grid-vue3";
import { computed, defineComponent, h, type PropType } from "vue";

const themes = {
  light: themeQuartz,
  dark: themeQuartz.withPart(colorSchemeDark),
};

/** {@link AgGrid} with automatic Quartz light/dark theme based on the system preference. */
export const AgGridVue = defineComponent({
  name: "AgGridVue",
  props: {
    gridOptions: {
      type: Object as PropType<GridOptions<GridRow>>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();

    return () =>
      h(AgGrid, {
        gridOptions: props.gridOptions as unknown as GridOptions<unknown>,
        theme: theme.value,
        style: { height: "100%", width: "100%" },
      });
  },
});

function useTheme() {
  const colorScheme = useDetectColorScheme();
  return computed(() => themes[colorScheme.value]);
}
