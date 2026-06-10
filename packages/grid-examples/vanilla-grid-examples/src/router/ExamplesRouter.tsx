import { ExamplesRouterIndexPage } from "#router/ExamplesRouterIndexPage.tsx";
import {
  type ExampleOnUnmountedCallback,
  invokeOnUnmounted,
  onUnmountedCallbacksRegistry,
} from "#router/onUnmountedCallbacksRegistry.ts";
import type {
  ExampleComponent,
  ExamplesRouterOptions,
  UnmountExamplesRouter,
} from "#router/types.ts";

import { isValidExampleId, type VanillaGridPluginId } from "@jsoc/grid-docs";
import {
  readExampleIdSearchParam,
  subscribeLocationChange,
} from "@jsoc/grid-examples-core";

export function mountExamplesRouter<P extends VanillaGridPluginId>(
  options: ExamplesRouterOptions<P>,
): UnmountExamplesRouter {
  let exampleComponent = exampleDispatcher(options);

  const unsubscribeLocationChange = subscribeLocationChange(() => {
    invokeOnUnmounted(exampleComponent);
    exampleComponent = exampleDispatcher(options);
  });

  // return a function that performs cleanup
  return () => {
    invokeOnUnmounted(exampleComponent);
    unsubscribeLocationChange();
  };
}

let currentComponentBeingRendered: ExampleComponent | undefined;

function exampleDispatcher<P extends VanillaGridPluginId>(
  options: ExamplesRouterOptions<P>,
): ExampleComponent | undefined {
  const { root, pluginId, components } = options;
  const exampleId = readExampleIdSearchParam();

  if (!exampleId) {
    root.replaceChildren(<ExamplesRouterIndexPage {...options} />);
    return undefined;
  }

  if (!isValidExampleId("vanilla-grid", pluginId, exampleId)) {
    root.replaceChildren(`Invalid example ID: "${exampleId}"`);
    return undefined;
  }

  root.replaceChildren();
  const component = components[exampleId];
  currentComponentBeingRendered = component;

  try {
    component(options.root);
  } finally {
    currentComponentBeingRendered = undefined;
  }

  return component;
}

/**
 * Registers a callback to invoke when the current component is unmounted.
 *
 * This should be only called inside the component which is part of {@link ExamplesRouterOptions.components}.
 *
 * @param callback - The callback to invoke when the component is unmounted.
 * @throws If the callee is not part of {@link ExamplesRouterOptions.components}.
 */
export function onUnmounted(callback: ExampleOnUnmountedCallback) {
  if (!currentComponentBeingRendered) {
    throw new Error(
      "onUnmounted() can only be called when any route of ExamplesRouter is being rendered",
    );
  }

  onUnmountedCallbacksRegistry.set(currentComponentBeingRendered, callback);
}
