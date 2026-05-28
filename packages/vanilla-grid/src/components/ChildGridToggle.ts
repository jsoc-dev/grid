import {
  BaseGridSchema,
  type ColumnGeneratorParams,
  type GridRow,
} from "@jsoc/grid-core";
import { html, render, type TemplateResult } from "lit-html";

export type ChildGridToggleOptions = {
  row: GridRow;
  columnParams: ColumnGeneratorParams<"ujsonObject" | "ujsonObjectArray">;
};
export function ChildGridToggle({
  row,
  columnParams,
}: ChildGridToggleOptions): TemplateResult {
  const { columnKey, gridSchema } = columnParams;
  BaseGridSchema.assertInstance(gridSchema);
  const gridStore = gridSchema.store;
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
