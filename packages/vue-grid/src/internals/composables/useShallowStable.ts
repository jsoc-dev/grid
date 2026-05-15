import { shallowEqual } from "@jsoc/utils";
import { type ShallowRef, shallowRef, watch } from "vue";

export function useShallowStable<T>(value: T): ShallowRef<T> {
  const stable = shallowRef(value);

  watch(
    () => value,
    (next) => {
      if (!shallowEqual(stable.value, next)) {
        stable.value = next;
      }
    },
  );

  return stable;
}
