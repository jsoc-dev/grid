import { useShallowStable } from "#internals/composables/useShallowStable.ts";

import {
  BaseGridStore,
  type GridData,
  type GridStore,
  type PluginConfig,
  type PluginConfigGenerator,
  type PluginConfigGeneratorOptions,
} from "@jsoc/grid-core";
import {
  type MaybeRefOrGetter,
  type ShallowRef,
  shallowRef,
  toValue,
  watch,
} from "vue";

/**
 * Creates a {@link GridStore} that is recreated when inputs change shallowly.
 */
export function useGridStoreMemo<C extends PluginConfig>(
  data: MaybeRefOrGetter<GridData>,
  configGenerator: PluginConfigGenerator<C>,
  configGeneratorOptions?: MaybeRefOrGetter<
    PluginConfigGeneratorOptions<C> | undefined
  >,
): ShallowRef<GridStore<C>> {
  const options = useShallowStable(configGeneratorOptions);
  const gridStore = shallowRef(
    new BaseGridStore({
      data: toValue(data),
      configGenerator,
      configGeneratorOptions: options.value,
    }),
  );

  // Do not pass `configGenerator` as a watch source — Vue treats functions as getters and calls them.
  watch(
    () => [toValue(data), options.value] as const,
    () => {
      gridStore.value = new BaseGridStore({
        data: toValue(data),
        configGenerator,
        configGeneratorOptions: options.value,
      });
    },
  );

  return gridStore;
}
