import type { View } from "#types.ts";

declare global {
  interface DOMStringMap {
    jsonPreviewView?: View;
  }
}

/**
 * Reads the active view from the document element's data attribute.
 *
 * By the time React mounts, this attribute has already been set
 * by the content script at `document_start`.
 */
export function getActiveView(): View {
  return document.documentElement.dataset.jsonPreviewView === "table"
    ? "table"
    : "raw";
}

/**
 * Sets the active view on the document element's data attribute.
 *
 * The CSS selector `[data-json-preview-view="table"]` reads this attribute
 * to hide the default JSON preview elements.
 */
export function setActiveView(view: View): void {
  document.documentElement.dataset.jsonPreviewView = view;
}
