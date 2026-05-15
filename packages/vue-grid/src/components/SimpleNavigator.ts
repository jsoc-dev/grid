import {
  useGridStoreContext,
  useGridStoreSelector,
} from "#composables/index.ts";

import { computed, defineComponent, h } from "vue";

export type SimpleNavigatorSlotProps = {
  canRemove: boolean;
  removeActiveSchema: () => void;
};

export const SimpleNavigator = defineComponent({
  name: "SimpleNavigator",
  setup(_, { slots }) {
    const gridStore = useGridStoreContext();
    const totalChildSchemas = useGridStoreSelector(gridStore, (store) =>
      store.getTotalChildSchemas(),
    );
    const canRemove = computed(() => totalChildSchemas.value > 0);
    const removeActiveSchema = () => gridStore.removeChildSchema();

    return () => {
      const slotProps: SimpleNavigatorSlotProps = {
        canRemove: canRemove.value,
        removeActiveSchema,
      };

      return (
        slots.default?.(slotProps) ??
        h(
          "button",
          {
            type: "button",
            disabled: !canRemove.value,
            onClick: removeActiveSchema,
          },
          canRemove.value ? "Back" : "Root",
        )
      );
    };
  },
});
