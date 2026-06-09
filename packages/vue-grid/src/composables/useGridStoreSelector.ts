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

/**
 * Subscribes to a {@link GridStore} and returns a computed snapshot of `selector(store)`.
 *
 * The selector re-runs when the store emits, when `gridStoreSource` changes, and when any
 * reactive values read inside the selector change (same idea as React's `useSyncExternalStore`
 * getSnapshot running again on each render).
 */
export function useGridStoreSelector<C extends PluginConfig, T>(
  gridStoreSource: MaybeRefOrGetter<GridStore<C>>,
  selector: (gridStore: GridStore<C>) => T,
): ComputedRef<T> {
  const storeRevision = shallowRef(0);
  let stop: (() => void) | undefined;

  const bind = (store: GridStore<C>) => {
    stop?.();
    stop = store.subscribe(() => {
      storeRevision.value++;
    });
  };

  bind(toValue(gridStoreSource));

  watch(
    () => toValue(gridStoreSource),
    (store) => bind(store),
    { flush: "sync" },
  );

  onScopeDispose(() => stop?.());

  return computed(() => {
    void storeRevision.value;
    return selector(toValue(gridStoreSource));
  });
}
