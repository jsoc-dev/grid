import { EXAMPLE_ID_SEARCH_PARAM } from "@jsoc/grid-docs";

export function readExampleId(): string | undefined {
  return (
    new URLSearchParams(window.location.search).get(EXAMPLE_ID_SEARCH_PARAM) ??
    undefined
  );
}

/**
 * Subscribes to `exampleId` changes from `window.location.search`, matching react/vue examples.
 */
export function subscribeExampleId(listener: () => void): () => void {
  const onPopState = () => {
    listener();
  };
  window.addEventListener("popstate", onPopState);
  return () => {
    window.removeEventListener("popstate", onPopState);
  };
}

export function setExampleId(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(EXAMPLE_ID_SEARCH_PARAM, id);
  history.pushState(null, "", url);
}
