import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
} from "vue";

export function useGridStoreSelector<C extends PluginConfig, T>(
  gridStoreSource: MaybeRefOrGetter<GridStore<C>>,
  selector: (gridStore: GridStore<C>) => T,
): ComputedRef<T> {
  const snapshot = shallowRef(selector(toValue(gridStoreSource)));
  let stop: (() => void) | undefined;

  const bind = (store: GridStore<C>) => {
    stop?.();
    snapshot.value = selector(store);
    stop = store.subscribe(() => {
      snapshot.value = selector(store);
    });
  };

  bind(toValue(gridStoreSource));

  watch(
    () => toValue(gridStoreSource),
    (store) => bind(store),
    { flush: "sync" },
  );

  onScopeDispose(() => stop?.());

  return computed<T>(() => snapshot.value as T);
}
