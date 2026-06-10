import type { ExampleComponent } from "#router/types.ts";

export type ExampleOnUnmountedCallback = () => void;

export const onUnmountedCallbacksRegistry = new WeakMap<
  ExampleComponent,
  ExampleOnUnmountedCallback
>();

export function invokeOnUnmounted(exampleComponent?: ExampleComponent) {
  if (!exampleComponent) return;

  const callback = onUnmountedCallbacksRegistry.get(exampleComponent);

  if (!callback) return;

  callback();
  onUnmountedCallbacksRegistry.delete(exampleComponent);
}
