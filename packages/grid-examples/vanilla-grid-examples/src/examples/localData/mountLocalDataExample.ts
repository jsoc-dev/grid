import "@jsoc/grid-examples-core/css/local-data-editor.css";

import { createLocalDataEditor } from "#examples/localData/createLocalDataEditor.ts";
import { subscribeLocalData } from "#examples/localData/subscribeLocalData.ts";
import type { ExampleRenderer } from "#examples/types.ts";
import { createErrorMessage } from "#shared/ErrorMessage.tsx";

import { getLocalDataEditorEnabled } from "@jsoc/grid-examples-core";

/**
 * Subscribes to local broadcast data and invokes `render` when data is available.
 * Shows a fallback message when data is missing and an error message when rendering fails.
 */
export function mountLocalDataExample(
  root: HTMLElement,
  render: ExampleRenderer,
): () => void {
  const showEditor = getLocalDataEditorEnabled();
  const destroyEditor = showEditor ? createLocalDataEditor() : undefined;

  const unsubscribe = subscribeLocalData((data) => {
    if (!data) {
      root.replaceChildren("No data");
      return;
    }

    try {
      render(data);
    } catch (error) {
      root.replaceChildren(createErrorMessage({ error }));
    }
  });

  return () => {
    destroyEditor?.();
    unsubscribe();
  };
}
