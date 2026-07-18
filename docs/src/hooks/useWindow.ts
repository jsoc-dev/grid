"use client";

import { useSyncExternalStore } from "react";

// no-op subscribe function as window doesn't change over time
const noopSubscribe = () => () => {};

export function useWindow(): Window | undefined {
  // using useSyncExternalStore as accessing window directly will break SSR,
  // and if accessed conditionally it will cause hydration mismatch
  return useSyncExternalStore(
    noopSubscribe,
    () => window,
    () => undefined,
  );
}
