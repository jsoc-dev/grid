import { getGridStore } from "#helpers/getGridStore.ts";

import type { GridStoreId } from "@jsoc/grid-core";
import { html, render } from "lit-html";

export type SimpleNavigatorOptions = {
  storeId: GridStoreId;
};

function SimpleNavigator({ storeId }: SimpleNavigatorOptions) {
  const gridStore = getGridStore(storeId);
  const totalChildSchemas = gridStore.getTotalChildSchemas();

  const canRemove = totalChildSchemas > 0;
  const removeActiveSchema = () => gridStore.removeChildSchema();

  return html`<button ?disabled=${!canRemove} @click=${removeActiveSchema}>
    ${canRemove ? "Back" : "Root"}
  </button>`;
}

export function renderSimpleNavigator(
  options: SimpleNavigatorOptions,
  container: HTMLElement,
) {
  render(SimpleNavigator(options), container);
}
