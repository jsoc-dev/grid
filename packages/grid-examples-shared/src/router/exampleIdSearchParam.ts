import { notifyLocationChange } from "#router/subscribeLocationChange.ts";

import { EXAMPLE_ID_SEARCH_PARAM } from "@jsoc/grid-docs";

/** Reads the current example ID from `window.location.search`. */
export function readExampleIdSearchParam(
  searchParams?: URLSearchParams,
): string | undefined {
  searchParams ??= new URLSearchParams(window.location.search);
  return searchParams.get(EXAMPLE_ID_SEARCH_PARAM) ?? undefined;
}

/** Sets the example ID in `window.location.search` and notifies location subscribers. */
export function setExampleIdSearchParam(exampleId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(EXAMPLE_ID_SEARCH_PARAM, exampleId);
  history.pushState(null, "", url);
  notifyLocationChange();
}
