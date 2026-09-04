export * from "./PersistentBroadcastChannel.ts";
export * from "./subscribeBroadcastChannel.ts";

export type LocalDataExampleParams = {
  channelName: string;
  hideLocalDataEditor: "1";
};

export type LocalDataExampleParamKey = keyof LocalDataExampleParams;

function getSearchParam<K extends LocalDataExampleParamKey>(
  key: K,
): LocalDataExampleParams[K] | undefined {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const params = new URLSearchParams(search);
  return (params.get(key) as LocalDataExampleParams[K]) ?? undefined;
}

function setSearchParam<K extends LocalDataExampleParamKey>(
  url: string,
  param: K,
  value: LocalDataExampleParams[K],
): string {
  const queryIndex = url.indexOf("?");
  const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const params = new URLSearchParams(
    queryIndex === -1 ? "" : url.slice(queryIndex + 1),
  );

  params.set(param, value);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export function getLocalDataChannelName(): string {
  return getSearchParam("channelName") ?? "localData";
}

export function withCustomLocalDataChannelName(
  url: string,
  channelName: string,
): string {
  return setSearchParam(url, "channelName", channelName);
}

/** Returns whether the local data editor is enabled in the example app. */
export function getLocalDataEditorEnabled(): boolean {
  return getSearchParam("hideLocalDataEditor") !== "1";
}

/** Returns the given example url with the local data editor hidden via search param. */
export function withLocalDataEditorHidden(url: string): string {
  return setSearchParam(url, "hideLocalDataEditor", "1");
}
