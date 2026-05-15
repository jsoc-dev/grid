import { gridStoreInjectionKey } from "#internals/injection.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { defineComponent, type PropType,provide, toRef } from "vue";

export const GridStoreProvider = defineComponent({
  name: "GridStoreProvider",
  props: {
    value: {
      type: Object as PropType<GridStore<PluginConfig>>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(gridStoreInjectionKey, toRef(props, "value"));
    return () => slots.default?.();
  },
});
