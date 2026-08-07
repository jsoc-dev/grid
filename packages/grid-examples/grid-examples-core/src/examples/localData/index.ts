export * from "./PersistentBroadcastChannel.ts";
export * from "./subscribeBroadcastChannel.ts";

/** Broadcast channel name used by the localData examples. */
export const LOCAL_DATA_EXAMPLE_CHANNEL = "localData";

/**
 * Query parameter that hides the local data editor in example apps.
 * Set to {@link HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM_VALUE} to hide the editor.
 */
export const HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM = "hideLocalDataEditor";

/** Value of {@link HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM} that hides the editor. */
export const HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM_VALUE = "1";

/** Returns whether the local data editor is enabled in the example app. */
export function getLocalDataEditorEnabled(): boolean {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const params = new URLSearchParams(search);

  return (
    params.get(HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM) !==
    HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM_VALUE
  );
}

/** Returns the given example url with the local data editor hidden via search param. */
export function withLocalDataEditorHidden(url: string): string {
  const queryIndex = url.indexOf("?");
  const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const params = new URLSearchParams(
    queryIndex === -1 ? "" : url.slice(queryIndex + 1),
  );

  params.set(
    HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM,
    HIDE_LOCAL_DATA_EDITOR_SEARCH_PARAM_VALUE,
  );

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
