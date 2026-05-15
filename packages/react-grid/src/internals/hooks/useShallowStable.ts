import { shallowEqual } from "@jsoc/utils";
import { useRef } from "react";

export function useShallowStable<T>(value: T): T {
  const ref = useRef(value);

  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
