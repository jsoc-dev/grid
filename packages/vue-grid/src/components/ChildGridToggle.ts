import {
  useGridStoreContext,
  useGridStoreSelector,
} from "#composables/index.ts";

import type { ColumnKey, GridRow } from "@jsoc/grid-core";
import { computed, defineComponent, h, type PropType } from "vue";

export type ChildGridToggleSlotProps = {
  toggle: () => void;
  toggleStatus: boolean;
};

export const ChildGridToggle = defineComponent({
  name: "ChildGridToggle",
  props: {
    columnKey: {
      type: String as PropType<ColumnKey>,
      required: true,
    },
    row: {
      type: Object as PropType<GridRow>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const gridStore = useGridStoreContext();
    const origin = computed(() =>
      gridStore.getChildSchemaOrigin(props.row, props.columnKey),
    );
    const toggleStatus = useGridStoreSelector(gridStore, (store) =>
      store.hasChildSchema(origin.value),
    );
    const toggle = () => gridStore.toggleChildSchema(origin.value);

    return () => {
      const slotProps: ChildGridToggleSlotProps = {
        toggle,
        toggleStatus: toggleStatus.value,
      };

      return (
        slots.default?.(slotProps) ??
        h(
          "button",
          { type: "button", onClick: toggle },
          toggleStatus.value ? "Close" : "View",
        )
      );
    };
  },
});
