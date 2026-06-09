import {
  type AbortFetch,
  fetchRemoteData,
  type FetchStateListener,
  pendingState,
  REMOTE_DATA_EXAMPLE_URL,
} from "@jsoc/grid-examples-shared";

/**
 * Initiates a fetch request to the given URL and calls `listener` immediately with {@link pendingState} and then on each state change.
 * If `url` is not provided, it defaults to {@link REMOTE_DATA_EXAMPLE_URL}.
 */
export function subscribeRemoteData(
  listener: FetchStateListener,
  url: string = REMOTE_DATA_EXAMPLE_URL,
): AbortFetch {
  listener(pendingState);
  return fetchRemoteData(url, listener);
}
