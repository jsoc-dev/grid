import { shallowEqual } from "@jsoc/utils";
import {
  type MaybeRefOrGetter,
  type ShallowRef,
  shallowRef,
  toValue,
  watch,
} from "vue";

export function useShallowStable<T>(value: MaybeRefOrGetter<T>): ShallowRef<T> {
  const stable = shallowRef(toValue(value));

  watch(
    () => toValue(value),
    (next) => {
      if (!shallowEqual(stable.value, next)) {
        stable.value = next;
      }
    },
  );

  return stable;
}
