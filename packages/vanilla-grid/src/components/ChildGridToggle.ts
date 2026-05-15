import { getGridStore } from "#helpers/getGridStore.ts";

import type { ColumnKey, GridRow, GridStoreId } from "@jsoc/grid-core";
import { html, render, type TemplateResult } from "lit-html";

export type ChildGridToggleOptions = {
  row: GridRow;
  columnKey: ColumnKey;
  storeId: GridStoreId;
};

export function ChildGridToggle({
  row,
  columnKey,
  storeId,
}: ChildGridToggleOptions): TemplateResult {
  const gridStore = getGridStore(storeId);
  const origin = gridStore.getChildSchemaOrigin(row, columnKey);
  const toggleStatus = gridStore.hasChildSchema(origin);
  const toggle = () => gridStore.toggleChildSchema(origin);

  return html`<button @click=${toggle}>
    ${toggleStatus ? "Close" : "View"}
  </button>`;
}

export function renderChildGridToggle(
  options: ChildGridToggleOptions,
  container?: HTMLElement,
): HTMLElement {
  if (!container) {
    container = document.createElement("div");
  }

  render(ChildGridToggle(options), container);

  return container;
}
